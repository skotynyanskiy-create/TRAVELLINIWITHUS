import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';

export default function TravelTips() {
  return (
    <PageLayout>
      <SEO
        title="Consigli di Viaggio — Guide pratiche"
        description="Consigli pratici, budget, packing list, food guide e pianificazione per viaggiare con più criterio. Selezionati da Rodrigo & Betta di Travelliniwithus."
        canonical={`${SITE_URL}/consigli-di-viaggio`}
      />
      <Section className="pt-8">
        <Breadcrumbs items={[{ label: 'Consigli di Viaggio' }]} />
        <div className="mt-8">
          <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
            Consigli di viaggio
          </span>
          <h1 className="text-display-1">
            Consigli di Viaggio{' '}
            <span className="italic text-black/55">per partire con criterio</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">
            Consigli pratici, guide budget, packing list, food guide e tutto quello che serve per
            decidere meglio prima e durante il viaggio. Testato da noi, raccontato per voi.
          </p>
        </div>
      </Section>
    </PageLayout>
  );
}
