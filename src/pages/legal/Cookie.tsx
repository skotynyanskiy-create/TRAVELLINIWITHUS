import Breadcrumbs from '../../components/Breadcrumbs';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';

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
              Questo sito puo&apos; utilizzare cookie e tecnologie simili per garantire il corretto funzionamento delle
              pagine, migliorare la navigazione e raccogliere dati statistici in forma aggregata.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">1. Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file di testo salvati sul dispositivo dell&apos;utente durante la navigazione.
              Possono servire a ricordare preferenze, mantenere attive alcune funzioni o comprendere in modo tecnico
              come viene usato il sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">2. Tipologie di cookie</h2>
            <p>
              Possono essere presenti cookie tecnici, necessari al funzionamento del sito, e strumenti analitici o di
              terze parti utilizzati per comprendere l&apos;uso delle pagine o supportare servizi esterni collegati.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">3. Gestione dei cookie</h2>
            <p>
              L&apos;utente puo&apos; gestire o disabilitare i cookie dalle impostazioni del proprio browser. La disattivazione
              dei cookie tecnici puo&apos; limitare o compromettere alcune funzioni essenziali del sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">4. Servizi di terze parti</h2>
            <p>
              Alcune pagine possono rimandare a piattaforme esterne o integrare servizi che adottano una propria
              cookie policy. Per questi servizi fanno fede le informative pubblicate dai rispettivi fornitori.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">5. Aggiornamenti</h2>
            <p>
              Questa informativa puo&apos; essere aggiornata nel tempo in base a modifiche tecniche, normative o di
              configurazione del sito.
            </p>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
