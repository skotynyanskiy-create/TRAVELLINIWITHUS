import { motion } from 'motion/react';
import { ArrowRight, Instagram, ShieldCheck, Sparkles, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '../Section';
import type { HomeContent } from '../../config/siteContent';
import { CONTACTS } from '../../config/site';

const creatorIcons = [Instagram, Video, Sparkles];

function isExternalLink(link: string) {
  return /^https?:\/\//.test(link);
}

interface AboutPreviewProps {
  content: HomeContent['project'];
}

export default function AboutPreview({ content }: AboutPreviewProps) {
  return (
    <Section className="bg-[var(--color-sand)]" spacing="spacious">
      <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.8fr)] lg:items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--color-accent)]">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 max-w-4xl text-4xl font-serif leading-[1.02] text-[var(--color-ink)] md:text-5xl lg:text-[3.7rem]">
            {content.titleMain}
            <span className="mt-2 block text-[var(--color-accent-warm)]">{content.titleAccent}</span>
          </h2>
        </div>

        <p className="max-w-xl text-base leading-relaxed text-black/65">{content.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.18fr)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-[2.2rem] bg-[var(--color-ink)] p-8 text-white shadow-[var(--shadow-editorial)] md:p-10"
        >
          <div className="absolute inset-0 bg-topo opacity-14" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,124,0.22),transparent_30%)]" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/72">
              <ShieldCheck size={14} className="text-[var(--color-gold)]" />
              {content.methodLabel}
            </div>

            <h3 className="mt-6 max-w-sm text-3xl font-serif leading-tight md:text-4xl">
              {content.methodTitle}
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/78">
              {content.methodDescription}
            </p>

            <div className="mt-8 space-y-4">
              {content.methodPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/78 backdrop-blur-sm"
                >
                  {point}
                </div>
              ))}
            </div>

            <Link
              to={content.primaryCta.link}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition-all hover:border-transparent hover:bg-[var(--color-gold)]"
            >
              {content.primaryCta.label}
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06, duration: 0.65 }}
          className="trust-panel bg-white p-6 shadow-sm md:p-8"
        >
          <div className="overflow-hidden rounded-[1.7rem] border border-black/5 bg-[linear-gradient(180deg,#f9f7f3_0%,#f3ede3_100%)]">
            <div className="relative aspect-[16/8] overflow-hidden">
              <img
                src="/hero-adventure.jpg"
                alt={content.artDirection.imageAlt}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,12,0.05)_0%,rgba(12,12,12,0.14)_55%,rgba(12,12,12,0.62)_100%)]" />
              <div className="absolute left-5 top-5 rounded-full bg-white/88 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)] backdrop-blur-md">
                {content.artDirection.shotIntent}
              </div>
              <div className="absolute bottom-5 left-5 right-5 text-sm leading-relaxed text-white/84">
                {content.artDirection.imageCaption}
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/42">
              {content.creatorLabel}
            </div>
            <h3 className="mt-3 text-3xl font-serif leading-tight text-[var(--color-ink)]">
              {content.creatorTitle}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/66">
              {content.creatorDescription}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-black/45">
              <span>{CONTACTS.instagramHandle}</span>
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span>{CONTACTS.tiktokHandle}</span>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {content.creatorBenefits.map((item, index) => {
                const Icon = creatorIcons[index] ?? Sparkles;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-black/5 bg-[var(--color-sand)] px-5 py-5"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--color-accent)] shadow-sm">
                      <Icon size={18} />
                    </div>
                    <h4 className="text-lg font-serif text-[var(--color-ink)]">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-black/62">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isExternalLink(content.secondaryCta.link) ? (
                <a
                  href={content.secondaryCta.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all hover:gap-3 hover:text-[var(--color-accent-warm)]"
                >
                  {content.secondaryCta.label}
                  <ArrowRight size={14} />
                </a>
              ) : (
                <Link
                  to={content.secondaryCta.link}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-ink)] transition-all hover:gap-3 hover:text-[var(--color-accent-warm)]"
                >
                  {content.secondaryCta.label}
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
