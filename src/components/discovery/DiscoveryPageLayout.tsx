import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import Breadcrumbs, { type BreadcrumbItem } from '../Breadcrumbs';
import PageLayout from '../PageLayout';
import SEO from '../SEO';
import JsonLd from '../JsonLd';
import Section from '../Section';

export interface DiscoveryPageLayoutProps {
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbItems: BreadcrumbItem[];
  kicker: string;
  scriptAccent?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  heroAside?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  footerSlot?: ReactNode;
}

export default function DiscoveryPageLayout({
  seoTitle,
  seoDescription,
  canonical,
  jsonLd,
  breadcrumbItems,
  kicker,
  scriptAccent,
  title,
  subtitle,
  heroAside,
  filters,
  children,
  footerSlot,
}: DiscoveryPageLayoutProps) {
  return (
    <PageLayout>
      <SEO title={seoTitle} description={seoDescription} canonical={canonical} />
      {jsonLd && <JsonLd data={jsonLd} />}

      <Section className="pt-4" spacing="tight">
        <Breadcrumbs items={breadcrumbItems} />

        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid grid-cols-1 gap-10 border-b border-black/6 pb-12 md:mt-14 md:pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-14"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent-text)]">
              {kicker}
            </span>
            {scriptAccent && (
              <span
                aria-hidden="true"
                className="mt-4 block font-script text-2xl text-[var(--color-accent)]/75 md:text-3xl"
              >
                {scriptAccent}
              </span>
            )}
            <h1 className="mt-5 font-serif leading-[1.02] tracking-tight text-[var(--color-ink)] text-[clamp(2.75rem,6vw+1rem,5.5rem)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-black/65 md:text-lg">
                {subtitle}
              </p>
            )}
          </div>
          {heroAside && <div className="lg:pl-6">{heroAside}</div>}
        </motion.header>
      </Section>

      <Section spacing="tight" className="!pt-2">
        {filters}
        {children}
      </Section>

      {footerSlot}
    </PageLayout>
  );
}
