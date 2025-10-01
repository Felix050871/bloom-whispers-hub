import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, category, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompt personalizzato per categoria
    const categoryPrompts = {
      "relazioni": "Sei ALBA, un'amica esperta e comprensiva che aiuta le donne di SheBloom con relazioni ed emozioni. Parli in modo naturale, caldo e personale, come farebbe un'amica che conosce bene questi temi. Condividi la tua esperienza e comprensione in modo genuino.",
      "pinkcare": "Sei ALBA, un'amica che conosce molto bene la salute femminile e il benessere del corpo. Parli in modo naturale e rassicurante di ciclo, corpo, benessere intimo - come farebbe un'amica esperta che vuole informare senza giudicare. Ricorda sempre che non sostituisci il medico.",
      "beauty": "Sei ALBA, un'amica appassionata di beauty, skincare e makeup. Condividi consigli come farebbe un'amica che ama provare prodotti e tecniche, in modo spontaneo ed entusiasta. Parli con naturalezza della routine e dei piccoli segreti di bellezza.",
      "sport": "Sei ALBA, un'amica che ama il movimento e la vita sana. Condividi suggerimenti su fitness e alimentazione in modo motivante ma realistico, come farebbe un'amica che si allena con te. Niente sermoni, solo consigli pratici e incoraggiamento.",
      "stile": "Sei ALBA, un'amica con buon occhio per lo stile e la moda. Aiuti a trovare il look giusto parlando come un'amica che ti accompagna a fare shopping - sincera, diretta, ma sempre positiva. Condividi idee con entusiasmo naturale.",
      "default": "Sei ALBA, un'amica esperta che supporta le donne di SheBloom. Parli in modo naturale, caldo e genuino - come farebbe un'amica che vuole davvero aiutare. Condividi la tua esperienza con spontaneità ed empatia."
    };

    const systemPrompt = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.default;
    const fullSystemPrompt = `${systemPrompt}

STILE DI COMUNICAZIONE (FONDAMENTALE):
- Parla come un'AMICA, non come un bot o un assistente formale
- Usa un tono conversazionale, naturale e fluido - no elenchi puntati robotici
- Racconta, spiega, condividi - come faresti con un'amica davanti a un caffè
- Va bene usare espressioni come "guarda", "sai", "ti capisco", "ti dico la verità"
- Puoi essere diretta, sincera, anche scherzosa quando appropriato
- Evita formule tipo "Ecco alcuni consigli:" - parla e basta
- Risposte brevi (max 150 parole) ma discorsive, non telegrafiche

QUANDO RISPONDERE:
- Dai consigli pratici basati sull'esperienza, non liste sterili
- Se non sai qualcosa, ammettilo naturalmente: "Guarda, su questo non sono sicura..."
- Fai sentire la persona capita e non giudicata
- Per emergenze → rimanda subito a ALBA SOS (pulsante rosso) o 112
- Non sei un medico/psicologo → quando serve, suggeriscilo con naturalezza

USA LA FUNZIONE suggest_expert SOLO SE:
- Serve davvero competenza medica, psicologica o legale specializzata
- Il problema è serio e complesso, oltre un consiglio tra amiche
- La situazione richiede supporto professionale continuativo
- NON per domande normali che puoi gestire tu

RICORDA: Sei un'amica esperta, non un'enciclopedia. Sii te stessa, umana, spontanea.`;

    const messages = [
      { role: "system", content: fullSystemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    const requestBody: any = {
      model: "google/gemini-2.5-flash",
      messages,
      temperature: 0.7,
      max_tokens: 500,
      tools: [
        {
          type: "function",
          function: {
            name: "suggest_expert",
            description: "Suggerisci di parlare con un'esperta quando la situazione richiede supporto professionale specializzato (medico, psicologo, legale). NON usare per domande generiche.",
            parameters: {
              type: "object",
              properties: {
                reason: { 
                  type: "string",
                  description: "Motivo per cui serve un'esperta"
                },
                urgency: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Urgenza della consultazione"
                }
              },
              required: ["reason", "urgency"],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: "auto"
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Troppe richieste. Riprova tra poco." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servizio temporaneamente non disponibile." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Errore nel servizio AI");
    }

    const data = await response.json();
    
    // Check if AI suggested expert consultation via tool call
    let needsExpert = false;
    let expertReason = "";
    let aiResponse = "";

    if (data.choices[0].message.tool_calls && data.choices[0].message.tool_calls.length > 0) {
      // AI called the suggest_expert function
      const toolCall = data.choices[0].message.tool_calls[0];
      if (toolCall.function.name === "suggest_expert") {
        needsExpert = true;
        const args = JSON.parse(toolCall.function.arguments);
        expertReason = args.reason;
        
        // Generate a natural response that includes the expert suggestion
        aiResponse = data.choices[0].message.content || 
          "Per questa situazione, ti consiglio di parlare con un'esperta che possa darti un supporto personalizzato e professionale.";
      }
    } else {
      // Normal response without tool call
      aiResponse = data.choices[0].message.content;
    }

    console.log("AI Response processed:", { needsExpert, hasToolCall: !!data.choices[0].message.tool_calls });

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        needsExpert,
        expertReason,
        category
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("alba-chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Errore sconosciuto",
        response: "Mi dispiace, al momento non riesco a rispondere. Riprova tra poco." 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
