import { Instagram, Mail, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CONTACTS } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';
import InstagramGrid from './InstagramGrid';

const footerColumns = [
  {
    title: 'Esplora',
    links: [
      { to: '/destinazioni', label: 'Destinazioni' },
      { to: '/mappa', label: 'Mappa' },
    ],
  },
  {
    title: 'Pianifica',
    links: [
      { to: '/guide', label: 'Guide' },
      { to: '/risorse', label: 'Risorse' },
    ],
  },
  {
    title: 'Brand',
    links: [
      { to: '/chi-siamo', label: 'Chi siamo' },
      { to: '/trasparenza', label: 'Trasparenza' },
    ],
  },
  {
    title: 'Business',
    links: [
      { to: '/collaborazioni', label: 'Collaborazioni' },
      { to: '/media-kit', label: 'Media kit' },
      { to: '/contatti', label: 'Contatti' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy' },
      { to: '/cookie', label: 'Cookie' },
      { to: '/termini', label: 'Termini' },
      { to: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

export default function Footer() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: footerContent } = useSiteContent('footer');
  const footer = footerContent ?? siteContentDefaults.footer;
  const showInstagramGrid = location.pathname !== '/';

  const handleNewsletterClick = () => {
    if (location.pathname === '/') {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    sessionStorage.setItem('scrollToNewsletter', '1');
    navigate('/');
  };

  return (
    <>
      {showInstagramGrid && <InstagramGrid />}
      <footer className="border-t border-white/10 bg-[var(--color-footer)] text-zinc-400">
        <div className="pt-20 pb-16">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-2">
                <Link
                  to="/"
                  className="mb-3 inline-block text-3xl font-serif font-medium tracking-tight text-white"
                >
                  Travellini<span className="font-bold text-[var(--color-accent)]">with</span>us
                </Link>
                <span className="mb-8 block font-script text-lg text-white/60">
                  Posti particolari, esperienze vere.
                </span>
                <p className="mb-6 max-w-sm text-base font-light leading-relaxed text-zinc-400">
                  {footer.description}
                </p>
                <a
                  href={CONTACTS.mailto}
                  className="mb-8 block text-sm font-light text-zinc-400 transition-colors hover:text-white"
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
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                  <a
                    href={CONTACTS.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
                    </svg>
                  </a>
                </div>
              </div>

              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h4 className="mb-8 text-sm font-bold uppercase tracking-[0.3em] text-white">
                    {column.title}
                  </h4>
                  <ul className="space-y-5">
                    {column.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="inline-block text-base transition-colors hover:text-[var(--color-accent)]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    {column.title === 'Brand' && isAdmin && (
                      <li>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 text-base text-[var(--color-accent)] transition-colors hover:text-white"
                        >
                          <ShieldCheck size={16} /> Pannello admin
                        </Link>
                      </li>
                    )}
                    {column.title === 'Business' && (
                      <li>
                        <button
                          onClick={handleNewsletterClick}
                          className="inline-block text-left text-base transition-colors hover:text-[var(--color-accent)]"
                        >
                          Newsletter
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-12 md:flex-row">
              <div className="text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 md:text-left">
                &copy; {new Date().getFullYear()} Travelliniwithus.
              </div>

              <button
                onClick={handleNewsletterClick}
                className="rounded-full border border-white/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-[var(--color-accent)] hover:text-white"
              >
                {footer.newsletterButtonLabel}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
