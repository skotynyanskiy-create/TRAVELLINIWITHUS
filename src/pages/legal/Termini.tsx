import Breadcrumbs from '../../components/Breadcrumbs';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';

export default function Termini() {
  const breadcrumbItems = [{ label: 'Termini e Condizioni' }];

  return (
    <PageLayout>
      <SEO
        title="Termini e Condizioni"
        description="Termini e condizioni d'uso del sito Travelliniwithus."
      />
      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-10 shadow-sm md:p-16">
          <h1 className="mb-8 font-serif text-4xl md:text-5xl">Termini e Condizioni</h1>
          <div className="prose prose-slate max-w-none space-y-6 font-light leading-relaxed text-black/70">
            <p>
              L&apos;accesso e l&apos;uso del sito Travelliniwithus implicano l&apos;accettazione dei presenti termini e
              condizioni. Se non condividi questi termini, ti invitiamo a non utilizzare il sito.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">1. Contenuti del sito</h2>
            <p>
              Testi, immagini, video, elementi grafici e altri contenuti presenti sul sito appartengono a
              Travelliniwithus o ai rispettivi titolari, salvo diversa indicazione. Non possono essere riprodotti,
              distribuiti o riutilizzati senza autorizzazione.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">2. Uso consentito</h2>
            <p>
              L&apos;utente si impegna a utilizzare il sito in modo lecito, corretto e non lesivo dei diritti altrui, dei
              sistemi tecnici o dell&apos;immagine del progetto.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">3. Accuratezza delle informazioni</h2>
            <p>
              Ci impegniamo a mantenere il sito aggiornato e curato, ma non possiamo garantire in ogni momento
              l&apos;assenza assoluta di errori, interruzioni, cambi di disponibilita&apos;, variazioni di prezzo o modifiche a
              servizi gestiti da terzi.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">4. Link esterni e servizi di terzi</h2>
            <p>
              Il sito può includere collegamenti a servizi, piattaforme o siti esterni. Travelliniwithus non è
              responsabile dei contenuti, delle policy o delle condizioni applicate da tali soggetti terzi.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">5. Modifiche</h2>
            <p>
              Ci riserviamo il diritto di aggiornare in qualsiasi momento il sito, i contenuti e i presenti termini.
              La versione pubblicata su questa pagina è quella da considerare valida.
            </p>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
