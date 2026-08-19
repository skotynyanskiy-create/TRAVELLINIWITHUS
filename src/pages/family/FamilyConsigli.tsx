import { Instagram } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import FamilyEntryCard from '../../components/family/FamilyEntryCard';
import InterestPicker from '../../components/InterestPicker';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';
import { getFamilyEntries } from '../../config/familyLibrary';
import { siteContentDefaults } from '../../config/siteContent';
import { useSiteContent } from '../../hooks/useSiteContent';
import { usePersonalizedInterest } from '../../hooks/usePersonalizedInterest';
import { rankFamilyByInterest } from '../../config/audienceInterests';

/**
 * Consigli Travellini Family — ogni voce nasce da un post/reel reale.
 * Niente listicle inventate: se un consiglio non è stato vissuto, non c'è.
 */
export default function FamilyConsigli() {
  const { interest } = usePersonalizedInterest();
  const { data: content } = useSiteContent('family');
  const family = content ?? siteContentDefaults.family;
  const entries = rankFamilyByInterest(getFamilyEntries(), interest);

  return (
    <PageLayout>
      <SEO
        title="Consigli family — gravidanza e viaggio"
        description="Consigli veri su gravidanza e viaggio in famiglia, provati da Rodrigo & Betta: volare col pancione, organizzarsi, cosa serve davvero."
      />
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Family', href: '/family' }, { label: 'Consigli' }]} />
      </div>

      <Section spacing="default" maxWidth="default">
        <div className="max-w-3xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow,0.18em)] text-[var(--color-accent-text)]">
            Travellini Family
          </span>
          <h1 className="font-serif text-[length:var(--text-h1)] leading-[1.05] text-[var(--color-ink)]">
            {family.adviceTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-2)]">
            {family.adviceDescription}
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <FamilyEntryCard key={entry.id} entry={entry} priority={index === 0} />
            ))
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
              <p className="font-serif text-2xl text-[var(--color-ink)]">
                I primi consigli stanno arrivando.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-ink-2)]">
                Stiamo portando qui i momenti reali già raccontati su Instagram. Nel frattempo li
                trovi tutti sul profilo.
              </p>
              <a
                href="https://www.instagram.com/travellinifamily/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                <Instagram size={14} aria-hidden />
                @travellinifamily
              </a>
            </div>
          )}
        </div>
      </Section>

      <InterestPicker />
    </PageLayout>
  );
}
