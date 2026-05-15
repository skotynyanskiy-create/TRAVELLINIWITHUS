import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { renderToFile } from '@react-pdf/renderer';
import { CONTACTS, SITE_URL } from '../src/config/site';
import { LeadMagnetDocument, type LeadMagnetLocation } from '../src/pdf/LeadMagnetDocument';

dotenv.config();

const outputPath = path.join(process.cwd(), 'public', 'lead-magnet-posti-italiani.pdf');

/** Selezione editoriale pronta per revisione R+B prima della promozione in bio. */
const LEAD_MAGNET_LOCATIONS: LeadMagnetLocation[] = [
  {
    number: '01',
    name: 'Specchia',
    region: 'Puglia',
    why: 'Un borgo del Salento che funziona meglio quando lo vivi lento, lontano dalle ore piu affollate della costa. Pietra chiara, corti, botteghe e piazze piccole aiutano a capire il lato piu raccolto del sud. Ideale se volete alternare mare e una sera senza parcheggi impossibili.',
    howToReach:
      'Auto da Lecce in circa 1 ora. In treno si arriva a Tricase o Miggiano, poi taxi o transfer locale.',
    bestTime:
      'Maggio, giugno e settembre: caldo gestibile, strade piu tranquille e luce migliore nel tardo pomeriggio.',
    costEstimate: 'EUR 90-150 al giorno per coppia, esclusi spostamenti lunghi.',
    insiderTip:
      'Entrate prima del tramonto e cenate dopo una passeggiata: arrivare solo a sera inoltrata toglie meta del senso al borgo.',
  },
  {
    number: '02',
    name: 'Tricase Porto',
    region: 'Puglia',
    why: 'Non e una spiaggia da cartolina facile, ed e proprio per questo che resta interessante. Il porto piccolo, le scalette, l’acqua profonda e le case basse creano una pausa diversa dal Salento piu fotografato. Perfetto per chi cerca mare e ritmo locale nello stesso punto.',
    howToReach:
      'Auto da Lecce in circa 1 ora e 10. Parcheggio limitato nelle ore centrali: meglio arrivare presto.',
    bestTime: 'Giugno o settembre; ad agosto va scelto con orari intelligenti.',
    costEstimate: 'EUR 80-140 al giorno per coppia.',
    insiderTip:
      'Portate scarpe comode per scendere in acqua: non e il posto giusto se cercate sabbia e stabilimento.',
  },
  {
    number: '03',
    name: 'Acaya',
    region: 'Puglia',
    why: 'Piccola, ordinata, con un castello che rende la visita piu concreta di una semplice sosta fotografica. Funziona bene come mezza giornata tra Lecce e la costa adriatica. La scala ridotta la rende piacevole per coppie che vogliono una pausa senza riempire troppo l’itinerario.',
    howToReach:
      'Auto da Lecce in circa 20 minuti. Collegamenti pubblici possibili ma poco pratici per una giornata flessibile.',
    bestTime: 'Primavera e inizio autunno, soprattutto nelle ore meno calde.',
    costEstimate: 'EUR 70-120 al giorno per coppia se usata come tappa in itinerario.',
    insiderTip:
      'Non programmatela come attrazione principale di giornata: rende molto di piu se la abbinate a mare o Lecce.',
  },
  {
    number: '04',
    name: 'Vico del Gargano',
    region: 'Puglia',
    why: 'Un Gargano piu interno e meno immediato, con vicoli stretti, pietra, agrumi e un centro che chiede tempo. E una buona base emotiva se volete capire il promontorio oltre le spiagge. Il bello arriva camminando senza cercare solo il punto panoramico.',
    howToReach: 'Auto consigliata. Da Foggia circa 1 ora e 40; da Vieste circa 40 minuti.',
    bestTime: 'Aprile-giugno e settembre-ottobre, quando il Gargano respira meglio.',
    costEstimate: 'EUR 85-150 al giorno per coppia.',
    insiderTip:
      'Dormire una notte nel centro cambia la percezione: in visita rapida rischia di sembrare solo un borgo in piu.',
  },
  {
    number: '05',
    name: 'Scanno',
    region: 'Abruzzo',
    why: 'Ha una forza visiva precisa: strade ripide, pietra, lago vicino e un’identita che non sembra costruita per il turismo veloce. E adatta a un weekend lento, soprattutto se vi piacciono borghi e natura nello stesso viaggio. Richiede scarpe comode e voglia di salire.',
    howToReach:
      'Auto da Roma in circa 2 ore e 20. I mezzi pubblici esistono ma rendono il weekend meno agile.',
    bestTime: 'Maggio, giugno, ottobre o inverno se cercate atmosfera fredda e strade tranquille.',
    costEstimate: 'EUR 90-160 al giorno per coppia.',
    insiderTip: 'Non fermatevi solo al lago: il centro storico e la parte che resta addosso.',
  },
  {
    number: '06',
    name: 'Rasiglia',
    region: 'Umbria',
    why: 'E diventata piu nota, ma resta utile se inserita bene in un itinerario umbro. L’acqua attraversa il paese e crea un ritmo semplice, quasi domestico. Funziona per una sosta breve ma memorabile, non per una giornata intera.',
    howToReach:
      'Auto da Foligno in circa 30 minuti. Parcheggi esterni al borgo, poi si procede a piedi.',
    bestTime:
      'Primavera o autunno nei giorni feriali; weekend e ponti possono essere troppo pieni.',
    costEstimate: 'EUR 70-130 al giorno per coppia come tappa.',
    insiderTip: 'Arrivate presto o nel tardo pomeriggio: nelle ore centrali perde molta intimità.',
  },
  {
    number: '07',
    name: 'Castelluccio di Norcia',
    region: 'Umbria',
    why: 'Il valore non e solo la fioritura: e la misura del paesaggio, ampia e quasi silenziosa. Se ci andate fuori dal picco, resta comunque una delle esperienze piu forti dell’Appennino. Richiede rispetto per tempi, meteo e strada.',
    howToReach:
      'Auto obbligatoria. Da Norcia circa 35-45 minuti, con condizioni da verificare in inverno.',
    bestTime:
      'Fine giugno-inizio luglio per la fioritura; settembre e ottobre per un’esperienza piu quieta.',
    costEstimate: 'EUR 80-150 al giorno per coppia.',
    insiderTip: 'Controllate vento e visibilita: con meteo chiuso il posto cambia completamente.',
  },
  {
    number: '08',
    name: 'Lago di Tovel',
    region: 'Trentino',
    why: 'Un lago alpino molto fotografato, ma ancora capace di essere una scelta forte se lo trattate come camminata e non come sfondo. Il giro del lago aiuta a vederlo cambiare colore, luce e prospettiva. Meglio per coppie che vogliono natura ordinata e accessibile.',
    howToReach:
      'Auto fino ai parcheggi regolamentati della Val di Non; in alta stagione verificare navette e prenotazioni.',
    bestTime: 'Giugno, settembre e inizio ottobre. Agosto richiede partenza molto presto.',
    costEstimate: 'EUR 100-180 al giorno per coppia.',
    insiderTip:
      'Fate tutto il giro a piedi: fermarsi solo al primo punto panoramico lo rende molto piu banale.',
  },
  {
    number: '09',
    name: 'Val di Funes',
    region: 'Alto Adige',
    why: 'E una valle dove la scenografia e forte, ma l’esperienza dipende da quanto sapete rallentare. Le Odle dominano il paesaggio senza bisogno di aggiungere molto. Ideale per coppie che vogliono camminate leggere, masi, silenzio e un’immagine chiara della montagna.',
    howToReach:
      'Auto o bus da Bressanone. Con mezzi pubblici e possibile, ma serve pianificare gli orari.',
    bestTime:
      'Settembre e ottobre per luce e colori; giugno per prati verdi e temperature più miti.',
    costEstimate: 'EUR 130-230 al giorno per coppia.',
    insiderTip:
      'Evitate l’orario pieno delle foto alla chiesetta: la valle merita anche fuori dal frame più famoso.',
  },
  {
    number: '10',
    name: 'Bosa',
    region: 'Sardegna',
    why: 'Colorata senza essere solo decorativa, con il fiume, il castello e un ritmo piu morbido rispetto alle zone sarde piu battute. E una buona base per esplorare un pezzo di costa occidentale con meno pressione. Funziona se cercate Sardegna reale, non solo spiaggia.',
    howToReach: 'Auto da Alghero in circa 1 ora o da Oristano in circa 1 ora e 15.',
    bestTime: 'Maggio, giugno e settembre. Luglio-agosto sono possibili ma meno equilibrati.',
    costEstimate: 'EUR 100-190 al giorno per coppia.',
    insiderTip:
      'Salite al castello nel tardo pomeriggio e lasciate il centro per la cena: il cambio luce fa molta differenza.',
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
      locations={LEAD_MAGNET_LOCATIONS}
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
