import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function verifyWithSearch(content: string, title: string): Promise<string> {
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Sei un editor esperto di viaggi. Il tuo compito è verificare e arricchire il seguente articolo di viaggio.
    Usa la ricerca Google per assicurarti che tutte le informazioni storiche, culturali e generali siano precise, aggiornate e veritiere.
    Correggi eventuali inesattezze e aggiungi dettagli interessanti se pertinenti.
    Mantieni il tono di voce diretto, concreto e autentico — budget travel, food experience, posti reali. Niente retorica da luxury travel o da brochure turistica.
    
    Titolo: ${title}
    Contenuto attuale:
    ${content}
    
    Restituisci SOLO il contenuto dell'articolo revisionato in formato Markdown, senza introduzioni o conclusioni.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text || content;
}

export async function verifyWithMaps(content: string, title: string): Promise<string> {
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Sei un editor esperto di viaggi. Il tuo compito è verificare le informazioni geografiche e logistiche del seguente articolo.
    Usa Google Maps per verificare che i nomi dei luoghi, gli indirizzi, le distanze e le descrizioni geografiche siano precise e veritiere.
    Correggi eventuali inesattezze sui luoghi e aggiungi dettagli utili (es. quartieri corretti, vicinanza ad altri punti di interesse).
    Mantieni il tono di voce diretto, concreto e autentico — budget travel, food experience, posti reali. Niente retorica da luxury travel o da brochure turistica.
    
    Titolo: ${title}
    Contenuto attuale:
    ${content}
    
    Restituisci SOLO il contenuto dell'articolo revisionato in formato Markdown, senza introduzioni o conclusioni.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
    },
  });

  return response.text || content;
}
