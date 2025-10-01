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
      "relazioni": "Sei ALBA, l'assistente AI di SheBloom specializzata in Relazioni & Emozioni. Fornisci consigli empatici, pratici e rispettosi sulla gestione delle relazioni, emozioni e benessere emotivo.",
      "pinkcare": "Sei ALBA, l'assistente AI di SheBloom specializzata in PinkCare - Salute Femminile. Fornisci informazioni accurate su salute femminile, ciclo mestruale, contraccezione e benessere. Non sostituisci il parere medico.",
      "beauty": "Sei ALBA, l'assistente AI di SheBloom specializzata in Beauty & Make up. Aiuta con consigli su skincare, makeup, haircare e bellezza personalizzati.",
      "sport": "Sei ALBA, l'assistente AI di SheBloom specializzata in Sport & Nutrimento. Fornisci suggerimenti su fitness, nutrizione, workout e stile di vita sano.",
      "stile": "Sei ALBA, l'assistente AI di SheBloom specializzata in Stile & Identità. Aiuta con consigli di moda, outfit, styling e espressione personale.",
      "default": "Sei ALBA, l'assistente AI di SheBloom. Fornisci consigli pratici, empatici e personalizzati su benessere femminile, relazioni, bellezza e stile di vita."
    };

    const systemPrompt = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.default;
    const fullSystemPrompt = `${systemPrompt}

LINEE GUIDA IMPORTANTI:
- Tono empatico, chiaro, non giudicante
- Risposte concise e pratiche (max 200 parole)
- Per emergenze o situazioni di pericolo, indirizza SEMPRE a ALBA SOS (pulsante rosso) e al 112
- Non sostituisci professionisti medici o psicologi
- Rispetta la privacy e la sensibilità dei temi trattati

IMPORTANTE: Usa la funzione suggest_expert SOLO quando:
- La situazione richiede competenze mediche, psicologiche o legali specializzate
- Il problema è complesso e richiede supporto umano continuativo
- La persona sta affrontando una situazione seria che va oltre un consiglio generale
- NON usarla per domande generiche o che puoi rispondere tu stessa`;

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
