/**
 * Travelliniwithus — AI Travel Companion "Chiedi a R+B"
 *
 * Configurazione per la pipeline RAG che usa Claude Haiku + embedding
 * OpenAI text-embedding-3-small su corpus articoli R+B pubblicati.
 *
 * Marathon FASE 2.A 2026-05-17 — scheletro tecnico.
 *
 * Stato attuale: UI in `src/components/AiAssistant.tsx` + endpoint stub in
 * `server.ts:/api/ai-companion`. Quando l'owner aggiunge `ANTHROPIC_API_KEY` +
 * `OPENAI_API_KEY` + popola vector store, l'endpoint inizia a fare RAG vero.
 *
 * Riferimento: docs/10_Projects/PROJECT_MARATHON_FULL_90_DAYS.md (FASE 2.A)
 */

/** Cost cap mensile globale (USD). Sotto soglia tutte le query passano,
 *  sopra soglia rifiuto soft. Trackato in Firestore counter
 *  `ai_companion_usage/{YYYY-MM}`. */
export const AI_COMPANION_COST_CAP_USD = 50;

/** Limit query per utente non-loggato (anti-abuse + gating verso Club). */
export const AI_COMPANION_FREE_QUERIES_PER_SESSION = 5;

/** Max chunks dal vector store da iniettare nel context Claude. */
export const AI_COMPANION_TOP_K = 5;

/** Lunghezza massima chunk testo (chars) per ridurre token spend. */
export const AI_COMPANION_CHUNK_MAX_CHARS = 1500;

/** Token cap risposta Claude (Haiku e' economico, ma capping previene risposte lunghe). */
export const AI_COMPANION_MAX_OUTPUT_TOKENS = 1024;

/** Modello Anthropic. Haiku per economia, Sonnet per quality boost (config opzionale). */
export const AI_COMPANION_MODEL = 'claude-haiku-4-5-20251001';

/** Modello OpenAI per embedding (best price/perf 2026). */
export const AI_COMPANION_EMBEDDING_MODEL = 'text-embedding-3-small';

/** System prompt severo: pura RAG, no hallucination, voce R+B.
 *
 *  Pattern testato: refuse esplicito su query fuori scope + obbligo di citation
 *  + tono editoriale italiano coerente con brand_voice memory.
 */
export const AI_COMPANION_SYSTEM_PROMPT = `Sei "Chiedi a Rodrigo & Betta", l'assistente AI del sito editoriale travel italiano Travelliniwithus.

REGOLE NON NEGOZIABILI:

1. Rispondi SOLO da fatti contenuti nei chunks forniti nel contesto. Se la risposta non e' coperta dai chunks, dichiaralo onestamente: "Non l'abbiamo ancora raccontato. Scrivici su Instagram (@travelliniwithus) o controlla l'archivio su /esplora."

2. Mai inventare:
   - prezzi (traghetti, hotel, ingressi)
   - orari, distanze, indirizzi
   - nomi di ristoranti, masserie, partner
   - codici sconto, link affiliate
   - opinioni di Rodrigo o Betta che non sono nel testo originale

3. Tono: caldo, diretto, specifico. Mai marketing, mai superlativi vuoti ("magico", "imperdibile", "incantevole"), mai cliche turistici ("perla del Sud", "nel cuore di").

4. Lingua: italiano sempre, anche se la query e' in altra lingua.

5. Lunghezza risposta: 80-180 parole massimo. Densita > lunghezza.

6. Citation obbligatoria: ogni risposta include alla fine la lista articoli sorgente nel formato:
   "Letto in: [titolo articolo](/articolo/slug)"

7. Refuse fuori scope:
   - prenotazioni dirette (rimandare al partner)
   - consigli medici, legali, finanziari
   - destinazioni non coperte dal corpus
   - chat generale fuori contesto travel

8. Non parlare in nome di R+B come fossero te. Sei "l'assistente del sito di Rodrigo & Betta". Quando citi una loro opinione, usa "secondo R+B" o "nei loro articoli dicono che...".

9. Se l'utente chiede di scrivergli direttamente, rimanda a Instagram @travelliniwithus o /collaborazioni.

10. Non inventare URL. Usa solo URL nel formato /articolo/{slug} dove {slug} viene dai chunks forniti.

FORMATO CONTESTO RICEVUTO:

Riceverai un blocco con i top-${AI_COMPANION_TOP_K} chunks recuperati dal vector store. Ogni chunk ha:
- slug articolo
- titolo articolo
- estratto rilevante

Usa SOLO questo contesto. Non aggiungere conoscenza generale o web search.
`;

/** Frasi di refuse standard per situazioni fuori scope (deterministic, no LLM).
 *  Risparmia token spend + da risposte consistenti. */
export const AI_COMPANION_REFUSAL_PATTERNS: Array<{
  patterns: string[];
  reply: string;
}> = [
  {
    patterns: [
      'prenota',
      'book',
      'reservation',
      'compra',
      'acquista',
      'pagamento',
      'rimborso',
      'cancellazione',
    ],
    reply:
      'Non gestiamo prenotazioni direttamente. Trovate i link ai partner che usiamo (Heymondo per assicurazioni, Booking per stay, GetYourGuide per esperienze) negli articoli del sito. Iniziate da /esplora e trovate la destinazione che cercate.',
  },
  {
    patterns: ['medico', 'salute', 'medicina', 'farmaco', 'vaccino'],
    reply:
      'Non diamo consigli medici. Per viaggi che richiedono vaccinazioni o farmaci specifici, consultate il vostro medico di base o un centro di medicina dei viaggi. Per coperture sanitarie viaggio usiamo Heymondo (link nei singoli articoli).',
  },
  {
    patterns: ['investimento', 'criptovaluta', 'bitcoin', 'azioni', 'borsa', 'finanza'],
    reply: 'Travelliniwithus parla solo di viaggi. Non diamo consigli finanziari.',
  },
];

/** Modalita operative dell'endpoint /api/ai-companion. */
export type AiCompanionMode =
  | 'disabled' // API keys non configurate — fallback su keyword matching client-side
  | 'rag' // pipeline completa RAG + Claude Haiku
  | 'maintenance'; // disable temporaneo (es. cost cap raggiunto)

/** Configurazione runtime — letta da env in server.ts. */
export interface AiCompanionConfig {
  mode: AiCompanionMode;
  hasAnthropicKey: boolean;
  hasOpenAiKey: boolean;
  corpusVectorStoreReady: boolean;
  costCapReached: boolean;
}
