import { Instagram, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import DealCard from '../../components/DealCard';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import SEO from '../../components/SEO';
import { getFamilyDeals } from '../../config/familyLibrary';
import { siteContentDefaults } from '../../config/siteContent';
import { useSiteContent } from '../../hooks/useSiteContent';
import { FAMILY_CATEGORY_LABEL } from '../../types/family';
import { PARTNERSHIP_LABEL } from '../../types/content';

/**
 * Vetrina Travellini Family — SOLO codici sconto e offerte reali delle
 * collaborazioni (niente carrello: decisione 2026-07-24). Ogni voce dichiara
 * la natura commerciale del rapporto (AGCOM/IAP): nessuna offerta è inventata.
 */
export default function FamilyShop() {
  const { data: content } = useSiteContent('family');
  const family = content ?? siteContentDefaults.family;
  const deals = getFamilyDeals();

  return (
    <PageLayout>
      <SEO
        title="Codici sconto family | Travellini Family"
        description="I codici sconto e le offerte reali delle collaborazioni family di Rodrigo & Betta, con la natura di ogni rapporto dichiarata."
      />
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Breadcrumbs items={[{ label: 'Family', href: '/family' }, { label: 'Codici e sconti' }]} />
      </div>

      <Section spacing="default" maxWidth="default">
        <div className="max-w-3xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow,0.18em)] text-[var(--color-accent-text)]">
            Travellini Family
          </span>
          <h1 className="font-serif text-[length:var(--text-h1)] leading-[1.05] text-[var(--color-ink)]">
            {family.shopTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-2)]">
            {family.shopDescription}
          </p>
        </div>

        <div className="mt-12">
          {deals.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {deals.map((entry) => (
                <div key={entry.id}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted-fg-2)]">
                    {FAMILY_CATEGORY_LABEL[entry.category]} ·{' '}
                    {PARTNERSHIP_LABEL[entry.partnership.kind] || 'Collaborazione'}
                    {entry.partnership.partner ? ` · ${entry.partnership.partner}` : ''}
                  </p>
                  <DealCard deal={entry.deal} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
              <p className="font-serif text-2xl text-[var(--color-ink)]">
                I primi codici family arrivano con le prossime collaborazioni.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-ink-2)]">
                Pubblichiamo qui solo codici reali e attivi, mai promozioni inventate. Intanto i
                consigli veri sono già online.
              </p>
              <a
                href="https://www.instagram.com/travellinifamily/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-accent)]"
              >
                <Instagram size={14} aria-hidden />
                @travellinifamily
              </a>
            </div>
          )}
        </div>

        {/* Trasparenza commerciale — sempre visibile, senza interazioni (AGCOM/IAP) */}
        <div className="mt-12 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[var(--color-accent)]"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-[var(--color-ink-2)]">
            <strong className="font-semibold text-[var(--color-ink)]">Trasparenza:</strong> alcuni
            link in questa pagina sono affiliati o frutto di collaborazioni: la natura di ogni
            rapporto (ADV, invito, gifted, affiliazione) è dichiarata accanto alla singola offerta.
            Se acquisti da questi link possiamo ricevere una commissione, senza costi extra per te.
            Consigliamo solo ciò che abbiamo usato davvero.
          </p>
        </div>
      </Section>
    </PageLayout>
  );
}
