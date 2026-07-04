import { Landmark, Mountain, Sparkles, Utensils, Waves, type LucideIcon } from 'lucide-react';
import SEO from '@/src/components/SEO';
import Section from '@/src/components/Section';
import Newsletter from '@/src/components/Newsletter';
import FinalCtaSection from '@/src/components/FinalCtaSection';
import HeroCopertina from '@/src/components/home/atlante/HeroCopertina';
import CategoryPill from '@/src/components/home/atlante/CategoryPill';
import PezzoForte from '@/src/components/home/atlante/PezzoForte';
import ReelStrip from '@/src/components/home/atlante/ReelStrip';
import MetodoBand from '@/src/components/home/atlante/MetodoBand';
import ZoneBand from '@/src/components/home/atlante/ZoneBand';
import { slugifyType, type ContentType } from '@/src/config/contentTaxonomy';
import { SITE_URL } from '@/src/config/site';

interface CategoryCard {
  label: string;
  fullLabel: string;
  type: ContentType;
  icon: LucideIcon;
}

const CATEGORIES: CategoryCard[] = [
  {
    label: 'Food & Ristoranti',
    fullLabel: 'Dove mangiamo davvero',
    type: 'Food & Ristoranti',
    icon: Utensils,
  },
  { label: 'Insolito', fullLabel: 'Posti fuori dagli schemi', type: 'Insolito', icon: Sparkles },
  {
    label: 'Relax, terme e spa',
    fullLabel: 'Acqua calda e lentezza',
    type: 'Relax, terme e spa',
    icon: Waves,
  },
  {
    label: "Borghi e città d'arte",
    fullLabel: 'Pietra, storia, bellezza',
    type: "Borghi e città d'arte",
    icon: Landmark,
  },
  {
    label: 'Passeggiate panoramiche',
    fullLabel: 'Cammini con vista',
    type: 'Passeggiate panoramiche',
    icon: Mountain,
  },
];

/**
 * Home "Atlante Vivo" — rotta di anteprima /atlante (noindex, gated da
 * ATLANTE_PREVIEW). Navbar/Footer arrivano da Layout: qui solo il contenuto.
 * Nessuno <style> che nasconde il chrome: la hero convive con la navbar.
 */
export default function AtlanteHome() {
  return (
    <>
      <SEO
        noindex
        title="Atlante Vivo — anteprima home"
        description="Anteprima della nuova home Travelliniwithus: posti particolari provati da Rodrigo e Betta, reel reali e un metodo editoriale onesto."
        canonical={`${SITE_URL}/atlante`}
      />

      <HeroCopertina />

      {/* §2 — Rail categorie: sfoglia per tipo di posto */}
      <Section subtitle="Cosa cerchi" title="Sfoglia per tipo">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.type}
              label={cat.label}
              fullLabel={cat.fullLabel}
              type={cat.type}
              icon={cat.icon}
              to={`/esplora?type=${slugifyType(cat.type)}`}
            />
          ))}
        </div>
      </Section>

      {/* §3 — Il pezzo forte */}
      <PezzoForte />

      {/* §4 — Le storie (reel). Ancora #reel per la CTA della hero. */}
      <div id="reel">
        <ReelStrip />
      </div>

      {/* §5 — Il metodo */}
      <MetodoBand />

      {/* §6 — Esplora per zona */}
      <ZoneBand />

      {/* §7 — Newsletter (id="newsletter" interno) + §8 — CTA finale */}
      <div className="mx-auto max-w-7xl space-y-16 px-6 py-20 md:px-12 md:py-28">
        <Newsletter variant="editorial" source="atlante_home_newsletter" />
        <FinalCtaSection
          intent="discovery"
          secondaryLabel="Collabora con noi"
          secondaryTo="/collaborazioni"
        />
      </div>
    </>
  );
}
