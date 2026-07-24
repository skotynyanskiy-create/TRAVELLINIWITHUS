import { ArrowRight, Baby, Instagram, Tag } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import Breadcrumbs from '../../components/Breadcrumbs';
import FamilyEntryCard from '../../components/family/FamilyEntryCard';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';
import { getFamilyDeals, getFamilyEntries } from '../../config/familyLibrary';
import { siteContentDefaults } from '../../config/siteContent';
import { useSiteContent } from '../../hooks/useSiteContent';

/**
 * Hub Travellini Family — la porta dell'audience family (decision 2026-07-24).
 * Hero tipografico (la foto reale della gravidanza arriva in Fase 5, dopo la
 * conferma owner sui diritti asset). Contenuti SOLO da momenti reali.
 */
export default function FamilyHome() {
  const { data: content } = useSiteContent('family');
  const family = content ?? siteContentDefaults.family;
  const entries = getFamilyEntries().slice(0, 2);
  const dealsCount = getFamilyDeals().length;

  return (
    <PageLayout>
      <SEO
        title="Travellini Family — gravidanza e viaggi in famiglia"
        description="Il lato family di Rodrigo & Betta: la gravidanza, i viaggi col pancione e — presto — quelli col piccolo. Consigli veri e codici sconto dichiarati."
      />
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Family' }]} />
      </div>

      {/* Hero tipografico */}
      <Section spacing="default" maxWidth="default">
        <div className="max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow,0.18em)] text-[var(--color-accent-text)]">
            <Baby size={14} aria-hidden />
            {family.heroEyebrow}
          </span>
          <h1 className="font-serif text-[length:var(--text-h1)] leading-[1.05] text-[var(--color-ink)]">
            {family.heroTitleMain}{' '}
            <em className="italic text-[var(--color-accent)]">{family.heroTitleAccent}</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-2)]">
            {family.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/family/consigli"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              I consigli
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              to="/family/shop"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-7 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Tag size={14} aria-hidden />
              Codici e sconti
            </Link>
            <a
              href="https://www.instagram.com/travellinifamily/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
            >
              <Instagram size={15} aria-hidden />
              {family.instagramCtaLabel}
            </a>
          </div>
        </div>
      </Section>

      {/* Ultimi consigli reali */}
      <Section
        title={family.adviceTitle}
        subtitle="Dal pancione, senza filtri"
        spacing="default"
        maxWidth="default"
      >
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--color-ink-2)]">
          {family.adviceDescription}
        </p>
        <div className="space-y-8">
          {entries.map((entry) => (
            <FamilyEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/family/consigli"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-text)] transition-colors hover:text-[var(--color-accent)]"
          >
            Tutti i consigli
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </Section>

      {/* Vetrina codici + collaborazioni */}
      <Section spacing="default" maxWidth="default">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-sm)]">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">{family.shopTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-2)]">
              {family.shopDescription}
            </p>
            <Link
              to="/family/shop"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent-text)] transition-colors hover:text-[var(--color-accent)]"
            >
              {dealsCount > 0 ? `${dealsCount} codici attivi` : 'Apri la vetrina'}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-ink-deep)] p-8 text-white shadow-[var(--shadow-sm)]">
            <h2 className="font-serif text-2xl">{family.collabTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{family.collabDescription}</p>
            <Link
              to="/contatti?topic=collab"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            >
              {family.collabCtaLabel}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
