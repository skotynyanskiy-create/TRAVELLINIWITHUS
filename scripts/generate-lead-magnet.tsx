import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { renderToFile } from '@react-pdf/renderer';
import { CONTACTS, SITE_URL } from '../src/config/site';
import { LeadMagnetDocument, type LeadMagnetLocation } from '../src/pdf/LeadMagnetDocument';

dotenv.config();

const outputPath = path.join(process.cwd(), 'public', 'lead-magnet-posti-italiani.pdf');

/**
 * 10 luoghi italiani non ovvi.
 *
 * Placeholder iniziali strutturati con lo schema editoriale corretto. R+B
 * compileranno con luoghi realmente visitati (sostituire `name`, `region`,
 * `why`, `howToReach`, `bestTime`, `costEstimate`, `insiderTip`).
 *
 * Criteri di selezione consigliati:
 * - Italia, regioni meno battute (no Roma/Firenze/Venezia/Cinque Terre).
 * - Posti dove R+B sono andati davvero e tornati.
 * - Mix mare/montagna/borghi/cibo per coprire tutte le stagioni.
 * - Bilanciare 2-3 destinazioni regionali grandi + 7-8 microposti specifici.
 *
 * Tono: caldo, diretto, specifico. Niente cliche tipo "perla nascosta",
 * "luogo magico", "atmosfera fiabesca". Vedi docs/13_Content/LEAD_MAGNET_POSTI_ITALIANI.md
 * per linee guida copy complete.
 */
const PLACEHOLDER_LOCATIONS: LeadMagnetLocation[] = [
  {
    number: '01',
    name: '[Luogo 01]',
    region: '[Regione]',
    why: "Perche ci siamo tornati: [3 frasi sull'atmosfera, sui dettagli che lo rendono diverso, sul tipo di coppia che lo apprezza].",
    howToReach: '[Treno da X, oppure auto + ultimo miglio. Tempo medio.]',
    bestTime: '[Mesi consigliati] perche [stagione/eventi/luce].',
    costEstimate: 'EUR [X-Y] al giorno per coppia, escluso volo.',
    insiderTip: '[Cosa fare/evitare che non e su Google, in 1 frase.]',
  },
  {
    number: '02',
    name: '[Luogo 02]',
    region: '[Regione]',
    why: '[Stessa struttura — 3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '03',
    name: '[Luogo 03]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '04',
    name: '[Luogo 04]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '05',
    name: '[Luogo 05]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '06',
    name: '[Luogo 06]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '07',
    name: '[Luogo 07]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '08',
    name: '[Luogo 08]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '09',
    name: '[Luogo 09]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
  {
    number: '10',
    name: '[Luogo 10]',
    region: '[Regione]',
    why: '[3 frasi]',
    howToReach: '[Modalita]',
    bestTime: '[Periodo]',
    costEstimate: 'EUR [X-Y] al giorno per coppia.',
    insiderTip: '[Tip insider]',
  },
];

async function main() {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const landingUrl = process.env.APP_URL || SITE_URL;

  await renderToFile(
    <LeadMagnetDocument
      generatedAt={new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(
        new Date()
      )}
      landingUrl={landingUrl}
      locations={PLACEHOLDER_LOCATIONS}
      contacts={{
        email: CONTACTS.email,
        instagram: CONTACTS.instagramUrl,
        tiktok: CONTACTS.tiktokUrl,
        website: SITE_URL,
      }}
    />,
    outputPath
  );

  const stat = fs.statSync(outputPath);
  console.log(
    `[generate-lead-magnet] PDF generated: ${outputPath} (${Math.round(stat.size / 1024)} KB)`
  );
}

void main().catch((error) => {
  console.error('[generate-lead-magnet] Failed to generate lead magnet PDF.', error);
  process.exitCode = 1;
});
