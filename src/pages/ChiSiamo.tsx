import { Instagram, Mail, Camera, Compass, NotebookPen, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import PageLayout from '../components/PageLayout';
import OptimizedImage from '../components/OptimizedImage';
import Newsletter from '../components/Newsletter';
import Button from '../components/Button';
import Section from '../components/Section';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { CONTACTS, SITE_URL } from '../config/site';
import { siteContentDefaults } from '../config/siteContent';
import { useSiteContent } from '../hooks/useSiteContent';

export default function ChiSiamo() {
  const { data: content } = useSiteContent('about');
  const pageContent = content ?? siteContentDefaults.about;
  const focusIcons = [Compass, NotebookPen, Camera];

  return (
    <PageLayout>
      <SEO
        title="Chi Siamo"
        description="Scopri chi sono Rodrigo e Betta, il progetto Travelliniwithus e il nostro modo di raccontare posti particolari, esperienze memorabili e consigli utili."
        canonical={`${SITE_URL}/chi-siamo`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Travelliniwithus',
          url: SITE_URL,
          description:
            'Posti particolari, esperienze memorabili e consigli utili per chi vuole scoprire, salvare e vivere meglio ogni viaggio.',
          founders: [
            { '@type': 'Person', name: 'Gaetano Rodrigo' },
            { '@type': 'Person', name: 'Betta' },
          ],
          sameAs: [CONTACTS.instagramUrl, CONTACTS.tiktokUrl, CONTACTS.facebookUrl],
        }}
      />

      <Section className="pt-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-[var(--color-accent)]" />
              <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {pageContent.eyebrow}
              </span>
            </div>

            <div className="mb-8 inline-block">
              <h1 className="text-display-1">
                {pageContent.heroTitleMain} <br />
                <span className="italic text-black/60">{pageContent.heroTitleAccent}</span>
              </h1>
            </div>

            <p className="mb-6 max-w-2xl text-sm font-medium leading-relaxed text-[var(--color-accent-text)]">
              {pageContent.heroProofLine}
            </p>

            <div className="mb-10 space-y-6 text-lg font-light leading-relaxed text-black/70">
              {pageContent.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex gap-4">
                <a
                  href={CONTACTS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white"
                  aria-label="Instagram Travelliniwithus"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={CONTACTS.mailto}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white"
                  aria-label="Email Travelliniwithus"
                >
                  <Mail size={20} />
                </a>
                <a
                  href={CONTACTS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white"
                  aria-label="WhatsApp Travelliniwithus"
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href={CONTACTS.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white"
                  aria-label="TikTok Travelliniwithus"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1-.09z" />
                  </svg>
                </a>
              </div>
              <Button to={pageContent.primaryCtaLink} variant="primary" size="lg">
                {pageContent.primaryCtaLabel}
              </Button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-2xl)] shadow-[var(--shadow-premium)] transition-transform duration-700 hover:rotate-0 lg:rotate-2">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
                alt={pageContent.heroImageAlt}
                className="block h-full w-full object-cover"
              />
            </div>
            <div className="z-10 hidden max-w-xs rounded-[var(--radius-xl)] border border-[var(--color-ink)]/5 bg-[var(--color-surface)] p-8 shadow-[var(--shadow-premium)] md:absolute md:-bottom-8 md:-left-8 md:block">
              <p className="mb-2 text-xl font-serif italic text-[var(--color-accent)]">
                "{pageContent.quoteText}"
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                {pageContent.quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title={pageContent.focusTitle} subtitle={pageContent.focusSubtitle}>
        <div className="space-y-6">
          {pageContent.focusAreas.map((item, index) => {
            const Icon = focusIcons[index] ?? Compass;
            return (
              <div
                key={item.title}
                className="card-info flex flex-col gap-6 md:flex-row md:items-start"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-xl)] bg-white text-[var(--color-accent)] shadow-sm">
                  <Icon size={28} />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-serif">{item.title}</h3>
                  <p className="font-normal leading-relaxed text-black/70">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={pageContent.principlesTitle} subtitle={pageContent.principlesSubtitle}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {pageContent.principles.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-[var(--radius-xl)] border border-black/5 bg-[var(--color-sand)] p-10 transition-all duration-500 hover:shadow-[var(--shadow-premium)]"
            >
              <span className="absolute right-6 top-4 font-serif text-6xl text-[var(--color-accent)]/10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="relative z-10 mb-4 text-2xl font-serif">{item.title}</h3>
              <p className="relative z-10 font-normal leading-relaxed text-black/70">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="rounded-[3rem] bg-[var(--color-ink)] p-12 text-white md:p-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-serif md:text-5xl">{pageContent.audienceTitle}</h2>
          <p className="mx-auto mb-12 max-w-2xl font-normal leading-relaxed text-white/85">
            {pageContent.audienceDescription}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pageContent.audienceItems.map((item) => (
              <div key={item} className="rounded-3xl border border-white/8 bg-[#1C1C1C] p-8 text-left">
                <p className="font-light leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title={pageContent.timelineTitle} subtitle="Milestones">
        <div className="mx-auto max-w-3xl">
          {pageContent.timelineItems.map((milestone, idx) => (
            <motion.div
              key={`${milestone.year}-${milestone.title}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-8 pb-12 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                  {milestone.year}
                </div>
                {idx < pageContent.timelineItems.length - 1 && (
                  <div className="mt-2 h-full w-px bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-warm)]" />
                )}
              </div>
              <div className="pt-3">
                <h3 className="mb-2 text-2xl font-serif">{milestone.title}</h3>
                <p className="font-normal leading-relaxed text-black/70">{milestone.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Newsletter variant="sand" />
    </PageLayout>
  );
}
