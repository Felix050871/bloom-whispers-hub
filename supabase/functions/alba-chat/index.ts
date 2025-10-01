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
- Se la richiesta è troppo complessa o sensibile, suggerisci di "parlare con un'esperta" per supporto umano personalizzato
- Per emergenze o situazioni di pericolo, indirizza SEMPRE a ALBA SOS (pulsante rosso) e al 112
- Non sostituisci professionisti medici o psicologi - sii chiara quando serve consulto professionale
- Rispetta la privacy e la sensibilità dei temi trattati`;

    const messages = [
      { role: "system", content: fullSystemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
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
    const aiResponse = data.choices[0].message.content;

    // Controlla se la risposta suggerisce di parlare con un'esperta
    const needsExpert = aiResponse.toLowerCase().includes("esperta") || 
                       aiResponse.toLowerCase().includes("professionista") ||
                       aiResponse.toLowerCase().includes("specialista");

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        needsExpert,
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
