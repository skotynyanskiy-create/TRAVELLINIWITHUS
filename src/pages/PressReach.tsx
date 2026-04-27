import { ArrowRight, ExternalLink, Heart, Mail, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import PageLayout from '../components/PageLayout';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { BRAND_STATS, CONTACTS, SITE_URL } from '../config/site';
import { PROJECT_MILESTONES } from '../config/milestones';
import { PRESS_MENTIONS } from '../config/pressMentions';

const PAGE_URL = `${SITE_URL}/press-reach`;

const REACH_CARDS = [
  {
    label: 'Instagram',
    value: BRAND_STATS.instagramFollowers,
    detail: 'Community editoriale principale',
    href: CONTACTS.instagramUrl,
  },
  {
    label: 'TikTok',
    value: BRAND_STATS.tiktokFollowers,
    detail: 'Reach video verticale',
    href: CONTACTS.tiktokUrl,
  },
  {
    label: 'Reach mensile',
    value: BRAND_STATS.monthlyReach,
    detail: 'Cross-platform aggregato',
    href: undefined,
  },
  {
    label: 'Engagement rate',
    value: BRAND_STATS.engagementRate,
    detail: 'Average across content (last 90d)',
    href: undefined,
  },
];

export default function PressReachPage() {
  return (
    <PageLayout>
      <SEO
        title="Press & Reach — i numeri reali del progetto Travelliniwithus"
        description="La nostra reach editoriale, le milestone del progetto, le menzioni stampa. Materiali e contatto dedicato per giornalisti, partner e brand."
        canonical={PAGE_URL}
        breadcrumbs={[
          { name: 'Home', url: SITE_URL },
          { name: 'Press & Reach', url: PAGE_URL },
        ]}
      />

      <section className="bg-sand pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-12">
          <Breadcrumbs items={[{ label: 'Press & Reach' }]} />

          <div className="mt-8 max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-text">
              Press & Reach
            </p>
            <h1 className="mt-4 text-4xl font-serif leading-[1.05] text-ink md:text-6xl">
              I numeri reali del progetto,{' '}
              <span className="italic text-black/55">senza maquillage</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/70 md:text-lg">
              Non gonfiamo i numeri, non compriamo follower, non inventiamo menzioni stampa. Quello
              che vedi qui sotto e' la situazione reale del progetto Travelliniwithus. Se sei un
              giornalista o lavori in una testata e ci hai citato, scrivi a{' '}
              <a href={`mailto:${CONTACTS.email}`} className="underline hover:text-accent-text">
                {CONTACTS.email}
              </a>{' '}
              e aggiungiamo il riferimento.
            </p>
          </div>
        </div>
      </section>

      <Section spacing="default" maxWidth="wide">
        <div className="mb-10 flex items-center gap-3">
          <TrendingUp size={20} className="text-accent" />
          <h2 className="text-3xl font-serif text-ink md:text-4xl">Reach reale</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {REACH_CARDS.map((card) => {
            const Inner = (
              <>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-text">
                  {card.label}
                </span>
                <p className="mt-3 text-3xl font-serif text-ink md:text-4xl">{card.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-black/55">{card.detail}</p>
                {card.href && (
                  <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent-text">
                    Vai al canale <ExternalLink size={11} />
                  </span>
                )}
              </>
            );
            return card.href ? (
              <a
                key={card.label}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
              >
                {Inner}
              </a>
            ) : (
              <div
                key={card.label}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8"
              >
                {Inner}
              </div>
            );
          })}
        </div>
      </Section>

      <Section spacing="default" maxWidth="wide" className="bg-sand py-16 md:py-20">
        <div className="mb-10 flex items-center gap-3">
          <Heart size={20} className="text-accent" />
          <h2 className="text-3xl font-serif text-ink md:text-4xl">Milestone del progetto</h2>
        </div>
        <ol className="relative space-y-8 border-l-2 border-black/10 pl-8">
          {PROJECT_MILESTONES.map((m) => (
            <li key={`${m.date}-${m.label}`} className="relative">
              <span className="absolute -left-[2.55rem] flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent-text">
                {m.date}
              </span>
              <h3 className="mt-2 text-xl font-serif leading-tight text-ink md:text-2xl">
                {m.label}
              </h3>
              {m.description && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/65">
                  {m.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section spacing="default" maxWidth="wide">
        <div className="mb-10">
          <h2 className="text-3xl font-serif text-ink md:text-4xl">Menzioni stampa</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/65">
            Questa sezione e' costruita in modo onesto: viene popolata solo con menzioni stampa
            verificabili. Se ci hai citato in una testata, mandaci il link e l aggiungiamo qui.
          </p>
        </div>

        {PRESS_MENTIONS.length === 0 ? (
          <div className="rounded-4xl border border-black/5 bg-sand p-10 text-center md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-text">
              In costruzione
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-black/70">
              Stiamo iniziando a tracciare le menzioni stampa che riceviamo. Niente menzioni
              inventate, niente "as featured in" finti: quando ci sara' qualcosa di reale, lo
              mostreremo qui in modo trasparente.
            </p>
            <a
              href={`mailto:press@travelliniwithus.it?subject=${encodeURIComponent('Menzione stampa Travelliniwithus')}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-accent"
            >
              <Mail size={14} />
              Segnalaci una menzione
            </a>
          </div>
        ) : (
          <ul className="space-y-4">
            {PRESS_MENTIONS.map((p) => (
              <li
                key={p.url}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em]">
                  <span className="text-accent-text">{p.outlet}</span>
                  <span className="h-1 w-1 rounded-full bg-black/15" />
                  <span className="text-black/45">{p.date}</span>
                </div>
                <h3 className="mt-3 text-xl font-serif leading-tight text-ink md:text-2xl">
                  {p.title}
                </h3>
                {p.quote && (
                  <blockquote className="mt-3 border-l-2 border-accent/30 pl-4 text-sm italic leading-relaxed text-black/65">
                    {p.quote}
                  </blockquote>
                )}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-accent-text hover:text-accent"
                >
                  Leggi l articolo <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section spacing="default" maxWidth="default">
        <div className="rounded-4xl border border-black/5 bg-ink p-10 text-white md:p-14">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-14">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Per giornalisti
              </p>
              <h2 className="mt-4 text-3xl font-serif leading-tight md:text-4xl">
                Materiali e contatto stampa <span className="italic text-white/60">dedicati.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/75">
                Bio, foto in alta risoluzione, brand assets e statistiche audience: tutto nel media
                kit. Per richieste editoriali specifiche, intervista o partecipazione a eventi
                stampa, scrivi all email dedicata.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/media-kit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
              >
                Apri il media kit
                <ArrowRight size={14} />
              </Link>
              <a
                href="mailto:press@travelliniwithus.it"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-xs font-bold uppercase tracking-widest text-white/90 transition-colors hover:border-white hover:text-white"
              >
                <Mail size={14} />
                press@travelliniwithus.it
              </a>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
