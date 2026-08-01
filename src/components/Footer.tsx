import { Instagram, Mail, ShieldCheck } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import { useAudience } from '../context/AudienceContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_CREDENTIALS, BRAND_STATS, CONTACTS } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import SurfaceBadge from './SurfaceBadge';

export default function Footer() {
  const { isAdmin } = useAuth();
  const { data: footerContent } = useSiteContent('footer');
  const { data: navigationContent } = useSiteContent('navigation');
  const footer = footerContent ?? siteContentDefaults.footer;
  const navigation = navigationContent ?? siteContentDefaults.navigation;

  const { audience } = useAudience();
  const isCollabMode = audience === 'brand';

  return (
    <>
      <footer className="border-t border-white/10 bg-[var(--color-footer)] text-white/55">
        <div className="pt-20 pb-16">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="mb-16 grid grid-cols-1 gap-16 md:grid-cols-4 lg:grid-cols-5">
              <div className="md:col-span-2 lg:col-span-2">
                <Link
                  to="/"
                  className="mb-3 inline-block text-3xl font-serif font-medium tracking-tight text-white"
                >
                  Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
                </Link>
                <span className="mb-8 block font-serif italic text-base text-white/55">
                  Posti particolari, esperienze vere.
                </span>
                <p className="mb-6 max-w-sm text-base font-light leading-relaxed text-white/55">
                  {footer.description}
                </p>
                <a
                  href={CONTACTS.mailto}
                  className="mb-8 block text-sm font-light text-white/55 transition-colors hover:text-white"
                >
                  {CONTACTS.email}
                </a>

                <div className="flex items-center gap-4">
                  {[
                    { icon: Instagram, href: CONTACTS.instagramUrl, label: 'Instagram' },
                    { icon: Mail, href: CONTACTS.mailto, label: 'Email' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                      aria-label={social.label}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:text-white"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                  <a
                    href={CONTACTS.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
                    </svg>
                  </a>
                  <a
                    href={CONTACTS.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-white">
                  {footer.discoverTitle}
                </h3>
                <ul className="space-y-5">
                  <li>
                    <Link
                      to="/esplora"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.exploreLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mappa"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.mapLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/itinerari"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.itinerariesLabel}
                      <SurfaceBadge path="/itinerari" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/destinazione"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.destinationsLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shop"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.shopLabel}
                      <SurfaceBadge path="/shop" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/club"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.clubLabel}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-white">
                  {footer.resourcesTitle}
                </h3>
                <ul className="space-y-5">
                  <li>
                    <Link
                      to="/guida-in-regalo"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {footer.newsletterButtonLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/preferiti"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.favoritesLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/risorse"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.whatWeUseLabel}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-4 lg:col-span-1">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-white">
                  {footer.projectTitle}
                </h3>
                <ul className="mb-10 space-y-5">
                  <li>
                    <Link
                      to="/chi-siamo"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.aboutLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/family"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      Travellini Family
                      <SurfaceBadge path="/family" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collaborazioni"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.collaborationsLabel}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contatti"
                      className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                    >
                      {navigation.contactsLabel}
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 text-base text-[var(--color-accent)] transition-colors hover:text-white"
                      >
                        <ShieldCheck size={16} /> Pannello admin
                      </Link>
                    </li>
                  )}
                </ul>
                {isCollabMode ? (
                  <Link
                    to="/media-kit"
                    className="block w-full rounded-[var(--radius-md)] border border-[var(--color-accent-on-dark)] bg-[var(--color-ink-deep)] px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-[var(--color-accent-on-dark)] shadow-sm transition-all hover:bg-[var(--color-accent-hover)] hover:text-white"
                  >
                    Scarica Media Kit PDF →
                  </Link>
                ) : audience === 'family' ? (
                  <Link
                    to="/family/shop"
                    className="block w-full rounded-[var(--radius-md)] border border-transparent bg-[var(--color-accent)] px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-sm transition-all hover:brightness-110"
                  >
                    {navigation.familyShopLabel} →
                  </Link>
                ) : (
                  <Link
                    to="/guida-in-regalo"
                    className="block w-full rounded-[var(--radius-md)] border border-transparent bg-[var(--color-accent)] px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-[var(--color-ink)] shadow-sm transition-all hover:brightness-110"
                  >
                    {footer.newsletterButtonLabel}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-12 md:flex-row">
              <div className="text-center text-xs font-medium uppercase tracking-[0.18em] text-white/55 md:text-left">
                &copy; {new Date().getFullYear()} Travelliniwithus.{' '}
                <span className="hidden sm:inline">
                  · {BRAND_CREDENTIALS.metaVerifiedLabel} · {BRAND_CREDENTIALS.agcomLabel} ·{' '}
                  {BRAND_STATS.totalFollowers} community
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-10">
                {[
                  { to: '/privacy', label: 'Privacy' },
                  { to: '/cookie', label: 'Cookie' },
                  { to: '/termini', label: 'Termini' },
                  { to: '/disclaimer', label: 'Disclaimer' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="text-xs font-medium uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
