import Breadcrumbs from '../../components/Breadcrumbs';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';

export default function Disclaimer() {
  const breadcrumbItems = [{ label: 'Disclaimer Affiliazioni' }];

  return (
    <PageLayout>
      <SEO
        title="Disclaimer Affiliazioni"
        description="Informativa sulle affiliazioni di Travelliniwithus e sulla trasparenza dei link consigliati."
      />
      <Section className="pt-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-8 rounded-3xl border border-black/5 bg-white p-10 shadow-sm md:p-16">
          <h1 className="mb-8 font-serif text-4xl md:text-5xl">Disclaimer Affiliazioni</h1>
          <div className="prose prose-slate max-w-none space-y-6 font-light leading-relaxed text-black/70">
            <p>
              Alcune pagine del sito possono contenere link di affiliazione o segnalazioni commerciali. Questo viene
              indicato per trasparenza verso chi legge e utilizza i contenuti di Travelliniwithus.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">1. Cosa significa</h2>
            <p>
              Se acquisti un prodotto o prenoti un servizio tramite alcuni link presenti sul sito, Travelliniwithus
              puo&apos; ricevere una commissione senza costi aggiuntivi per te.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">2. Indipendenza editoriale</h2>
            <p>
              Le eventuali commissioni non determinano automaticamente i contenuti pubblicati. L&apos;obiettivo e&apos;
              consigliare strumenti, servizi o esperienze coerenti con il progetto e ritenuti utili per il pubblico.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">3. Trasparenza</h2>
            <p>
              Quando possibile, i contenuti sponsorizzati, i link affiliati o le collaborazioni commerciali vengono
              segnalati con chiarezza, in modo che l&apos;utente possa distinguere tra contenuto editoriale e contenuto
              promozionale.
            </p>

            <h2 className="mt-10 mb-4 font-serif text-2xl text-black">4. Supporto al progetto</h2>
            <p>
              L&apos;uso di link affiliati puo&apos; contribuire a sostenere il lavoro editoriale e la produzione di contenuti
              gratuiti pubblicati su Travelliniwithus.
            </p>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
