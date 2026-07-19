import { Helmet } from 'react-helmet-async';
import PageLayout from '../../components/PageLayout';
import { Diary } from '../../components/article';
import type { DiaryBeat } from '../../components/article';

/**
 * Fixture di sviluppo per la variante "Diario" (handoff
 * HANDOFF_diario-narrativo_ui-designer_to_frontend-builder.md).
 *
 * I 4 beat sono ricavati dal corpo narrativo REALE del seed Burton Juice
 * (src/data/articles/burton-juice-ristorante-tim-burton.seed.ts) — solo la
 * parte redazionale, mai la sezione "Il voto" (bloccata in attesa di
 * voto/pro/contro reali di R+B). Nessun dettaglio di viaggio inventato:
 * ogni testo è un estratto/parafrasi del body esistente.
 *
 * Le foto sono placeholder reali già presenti nel repo (nessuna foto AI),
 * in attesa del photo plan dedicato dell'asset-curator per Burton Juice.
 */
const DIARIO_PREVIEW_BEATS: DiaryBeat[] = [
  {
    id: 'specchio',
    title: 'Attraversare lo specchio, prima ancora di cenare',
    text: 'Il primo gesto, al The Burton Juice, non è sederti a tavola. È attraversare uno specchio. Sei nella sala di Alice, la luce è quella storta dei film di Tim Burton — e capisci subito che non sei venuto solo per cenare: sei entrato dentro una scenografia che ha deciso di darti da mangiare.',
    image: {
      src: '/images/brand/about-editorial.webp',
      alt: 'Foto segnaposto di sviluppo — sostituita dal photo plan reale di Burton Juice.',
      caption: 'Segnaposto di sviluppo, non la foto reale del locale.',
      credit: 'Fixture Diario',
    },
  },
  {
    id: 'attori-tra-i-tavoli',
    title: 'Quando il cameriere smette di essere cameriere',
    text: 'La differenza vera non è la scenografia — è che qui gli attori lavorano tra i tavoli. Non stanno su un palco lontano: entrano nella tua serata, coinvolgono i clienti in giochi a tema, e il confine tra chi mangia e chi recita si scioglie. Se sei una persona timida, qui difficilmente resti a guardare da fuori.',
    image: {
      src: '/images/brand/collab-work.webp',
      alt: 'Foto segnaposto di sviluppo — sostituita dal photo plan reale di Burton Juice.',
      caption: 'Segnaposto di sviluppo, non la foto reale del locale.',
      credit: 'Fixture Diario',
    },
  },
  {
    id: 'non-per-tutti',
    title: 'Non è un posto per tutti, ed è giusto così',
    text: "Per chi è: coppie e gruppi di amici che da una cena vogliono soprattutto il ricordo. Per chi no: se cerchi una cena tranquilla dove l'unico protagonista è il piatto, questo non è il posto giusto — la scena è ovunque, gli attori arrivano al tavolo. Meglio saperlo prima che a metà serata.",
    image: {
      src: '/images/brand/couple-travel.webp',
      alt: 'Rodrigo e Betta — foto reale della coppia, segnaposto di sviluppo per questo beat.',
      caption:
        'Beat people-led: Rodrigo & Betta nel frame (foto reale, non scattata da Burton Juice).',
      credit: 'Travelliniwithus',
    },
    peopleInFrame: true,
  },
  {
    id: 'a-chi-lo-porteresti',
    title: 'Se mentre leggevi hai già pensato a chi portarci',
    text: "È il tipo di posto particolare che andiamo a cercare in giro per il mondo — e questo ce l'avevamo quasi sotto casa, in Campania. Se mentre leggevi hai già pensato a chi ci porteresti, hai la risposta: salva questa pagina e mandala alla persona giusta.",
    image: {
      src: '/hero-adventure.jpg',
      alt: 'Foto segnaposto di sviluppo — sostituita dal photo plan reale di Burton Juice.',
      caption: 'Segnaposto di sviluppo, non la foto reale del locale.',
      credit: 'Fixture Diario',
    },
  },
];

/**
 * Pagina dev-only: monta il componente Diario in isolamento con la fixture
 * Burton Juice qui sopra. Nessuna scrittura su Firestore, nessuna
 * pubblicazione — la route che la espone è registrata SOLO quando
 * `import.meta.env.DEV` è vero (vedi App.tsx), quindi non esiste nel build
 * di produzione e non è raggiungibile/indicizzabile online.
 */
export default function DiarioPreview() {
  return (
    <PageLayout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
          Anteprima sviluppo — solo DEV
        </p>
        <h1 className="font-serif text-3xl leading-tight text-[var(--color-ink)] md:text-4xl">
          Diario narrativo — fixture Burton Juice
        </h1>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-ink-2)]">
          Questa pagina esiste solo in locale (<code>npm run dev</code>) per verificare il rendering
          della variante Diario di <code>Articolo.tsx</code>. I 4 beat sotto sono ricavati dal corpo
          narrativo reale del seed Burton Juice, esclusa la sezione recensione (ancora bloccata in
          attesa del voto di Rodrigo &amp; Betta). Nessun contenuto qui è pubblicato o scritto su
          Firestore.
        </p>
      </div>

      <div className="mx-auto mt-4 max-w-3xl px-5 md:px-8">
        <Diary
          beats={DIARIO_PREVIEW_BEATS}
          intro="Prima di essere logistica, un viaggio è una manciata di momenti che restano. Questi sono i quattro di questa serata."
        />
      </div>
    </PageLayout>
  );
}
