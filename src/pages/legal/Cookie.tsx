import Breadcrumbs from '../../components/Breadcrumbs';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';
import { openConsentPreferences } from '../../lib/consent';

export default function Cookie() {
  const breadcrumbItems = [{ label: 'Cookie Policy' }];

  return (
    <PageLayout>
      <SEO
        title="Cookie Policy"
        description="Informativa sui cookie di Travelliniwithus. Scopri quali tecnologie possono essere usate sul sito e come gestirle."
      />
      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-10 shadow-sm md:p-16">
          <h1 className="mb-8 font-serif text-4xl md:text-5xl">Cookie Policy</h1>
          <div className="prose prose-slate max-w-none space-y-6 font-light leading-relaxed text-black/70">
            <p>
              Questo sito può utilizzare cookie e tecnologie simili per garantire il corretto funzionamento delle
              pagine, migliorare la navigazione e raccogliere dati statistici in forma aggregata.
            </p>

            <div className="my-10 rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-sand)] p-6 not-prose">
              <h2 className="mb-3 font-serif text-xl text-black">Gestisci le tue preferenze</h2>
              <p className="mb-5 text-sm leading-relaxed text-black/70">
                Puoi modificare in ogni momento il consenso a cookie analitici e di marketing. Le scelte vengono
                salvate localmente sul tuo dispositivo.
              </p>
              <button
                type="button"
                onClick={openConsentPreferences}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                Apri preferenze cookie
              </button>
            </div>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">1. Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file di testo salvati sul dispositivo dell&apos;utente durante la navigazione.
              Possono servire a ricordare preferenze, mantenere attive alcune funzioni o comprendere in modo tecnico
              come viene usato il sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">2. Categorie di cookie utilizzate</h2>
            <p>
              <strong className="text-black">Necessari</strong>. Cookie tecnici indispensabili al funzionamento del
              sito: gestione della sessione, preferenze di consenso, sicurezza. Non richiedono consenso e non
              possono essere disattivati.
            </p>
            <p>
              <strong className="text-black">Analitici</strong>. Se attivati, caricano Google Analytics 4 per
              raccogliere dati anonimi aggregati sull&apos;utilizzo del sito (pagine viste, eventi, durata sessione).
              Non vengono usati per profilazione pubblicitaria.
            </p>
            <p>
              <strong className="text-black">Marketing</strong>. Se attivati, caricano Meta Pixel e TikTok Pixel per
              misurare l&apos;efficacia delle campagne pubblicitarie e abilitare il retargeting verso chi ha già
              visitato il sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">3. Servizi di terze parti che possono essere caricati</h2>
            <p>
              Google Analytics 4 (Google Ireland Ltd), Meta Pixel (Meta Platforms Ireland Ltd), TikTok Pixel
              (TikTok Technology Ltd). Ognuno di questi servizi dispone di una propria informativa privacy che
              regola le modalita&apos; di trattamento dei dati.
            </p>
            <p>
              Eventuali link di affiliazione a partner commerciali (es. Booking.com, Heymondo, Skyscanner,
              GetYourGuide, Airalo, Amazon) possono impostare cookie propri sui rispettivi siti una volta che
              l&apos;utente vi accede tramite il nostro link. Per questi servizi fanno fede le informative pubblicate
              dai fornitori.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">4. Come gestire le preferenze</h2>
            <p>
              La scelta iniziale viene richiesta all&apos;ingresso nel sito tramite banner. Puoi modificare la tua
              decisione in ogni momento usando il pulsante &ldquo;Apri preferenze cookie&rdquo; sopra, oppure
              cancellando i dati di navigazione del browser.
            </p>
            <p>
              In alternativa puoi gestire o bloccare i cookie dalle impostazioni del tuo browser. La disattivazione
              dei cookie tecnici può limitare o compromettere alcune funzioni essenziali del sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">5. Aggiornamenti</h2>
            <p>
              Questa informativa può essere aggiornata nel tempo in base a modifiche tecniche, normative o di
              configurazione del sito. La versione corrente è tracciata nel codice sorgente e il banner viene
              riproposto in caso di cambio sostanziale.
            </p>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
