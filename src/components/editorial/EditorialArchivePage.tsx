import { type ReactNode, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ArticleSkeleton from '../ArticleSkeleton';
import Breadcrumbs from '../Breadcrumbs';
import DemoContentNotice from '../DemoContentNotice';
import FinalCtaSection from '../FinalCtaSection';
import JsonLd from '../JsonLd';
import Newsletter from '../Newsletter';
import OptimizedImage from '../OptimizedImage';
import PageLayout from '../PageLayout';
import SEO from '../SEO';
import Section from '../Section';
import GuideCategoryBrowser from '../discovery/GuideCategoryBrowser';
import { PREVIEW_GUIDES } from '../../config/previewContent';
import { SITE_URL } from '../../config/site';
import { siteContentDefaults } from '../../config/siteContent';
import {
  type GuideCategory,
  getGuideCategoryFromQuery,
  slugifyGuideCategory,
} from '../../config/contentTaxonomy';
import { useSiteContent } from '../../hooks/useSiteContent';
import { fetchArticles } from '../../services/firebaseService';
import { formatDateValue, toMillis, type DateValue } from '../../utils/dateValue';
import {
  getPublicArticlePath,
  matchesPublicArticleSection,
  type PublicArticleSection,
} from '../../utils/articleRoutes';
import type { ArticleType } from '../article';

interface ArchiveArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
  type?: ArticleType;
  excerpt?: string;
  createdAt?: DateValue;
  readTime?: string;
  location?: string;
}

interface ArchivePillar {
  title: string;
  text: string;
}

interface EditorialArchivePageProps {
  section: PublicArticleSection;
  title: ReactNode;
  description: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  breadcrumbLabel: string;
  browseLabel: string;
  categoryPrompt: string;
  searchPlaceholder: string;
  resultSingular: string;
  resultPlural: string;
  emptyTitle: string;
  emptyDescription: string;
  previewMessage: string;
  cardCta: string;
  newsletterSource: string;
  heroCardTitle: string;
  heroCardIcon?: typeof BookOpen;
  pillars: readonly ArchivePillar[];
  categories: readonly GuideCategory[];
}

export default function EditorialArchivePage({
  section,
  title,
  description,
  eyebrow,
  seoTitle,
  seoDescription,
  canonicalPath,
  breadcrumbLabel,
  browseLabel,
  categoryPrompt,
  searchPlaceholder,
  resultSingular,
  resultPlural,
  emptyTitle,
  emptyDescription,
  previewMessage,
  cardCta,
  newsletterSource,
  heroCardTitle,
  heroCardIcon: HeroCardIcon = BookOpen,
  pillars,
  categories,
}: EditorialArchivePageProps) {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const queryCategory = getGuideCategoryFromQuery(searchParams.get('cat'));
  const selectedCategory =
    queryCategory && categories.includes(queryCategory) ? queryCategory : null;
  const previewSlugsForSection = useMemo(
    () =>
      new Set(
        PREVIEW_GUIDES.filter((preview) => matchesPublicArticleSection(section, preview)).map(
          (preview) => preview.slug
        )
      ),
    [section]
  );

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['articles', `${section}-archive`, demoSettings.showEditorialDemo],
    queryFn: async () => {
      const fetchedArticles = await fetchArticles();
      const typedArticles = fetchedArticles.filter((article) =>
        matchesPublicArticleSection(section, article)
      ) as ArchiveArticle[];

      if (demoSettings.showEditorialDemo) {
        const existingSlugs = new Set(typedArticles.map((article) => article.slug));
        const demoOnly = (PREVIEW_GUIDES as ArchiveArticle[]).filter(
          (preview) =>
            matchesPublicArticleSection(section, preview) && !existingSlugs.has(preview.slug)
        );
        return [...typedArticles, ...demoOnly];
      }

      if (typedArticles.length > 0) {
        return typedArticles;
      }

      return (PREVIEW_GUIDES as ArchiveArticle[]).filter((preview) =>
        matchesPublicArticleSection(section, preview)
      );
    },
  });

  if (error) {
    throw new Error(`Impossibile caricare ${resultPlural.toLowerCase()}`);
  }

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<GuideCategory, number>> = {};
    for (const article of articles) {
      if (!categories.includes(article.category as GuideCategory)) {
        continue;
      }

      const category = article.category as GuideCategory;
      counts[category] = (counts[category] ?? 0) + 1;
    }
    return counts;
  }, [articles, categories]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return articles
      .filter((article) => !selectedCategory || article.category === selectedCategory)
      .filter((article) => {
        if (!q) return true;
        return [article.title, article.excerpt, article.location, article.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      })
      .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  }, [articles, searchQuery, selectedCategory]);

  const usingPreview =
    articles.length > 0 && articles.every((article) => previewSlugsForSection.has(article.slug));

  const handleCategorySelect = (category: GuideCategory | null) => {
    if (!category) {
      setSearchParams({}, { replace: true });
      return;
    }

    setSearchParams({ cat: slugifyGuideCategory(category) }, { replace: true });
  };

  return (
    <PageLayout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalPath}
        noindex={usingPreview}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${browseLabel} - Travelliniwithus`,
          description: seoDescription,
          url: canonicalPath,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: breadcrumbLabel, item: canonicalPath },
            ],
          },
        }}
      />

      <Section className="pt-8" spacing="tight">
        <Breadcrumbs items={[{ label: breadcrumbLabel }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-accent-text)]">
              {eyebrow}
            </span>
            <h1 className="text-display-1">{title}</h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/68">{description}</p>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <HeroCardIcon className="text-[var(--color-accent)]" size={22} />
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-black/45">
                {heroCardTitle}
              </p>
            </div>
            <div className="grid gap-5">
              {pillars.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <CheckCircle2 className="mt-1 shrink-0 text-[var(--color-accent)]" size={18} />
                  <div>
                    <p className="font-serif text-lg">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/58">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="tight">
        <div className="mb-2">
          <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-black/45">
            {categoryPrompt}
          </h2>
          <GuideCategoryBrowser
            categories={categories}
            basePath={`/${section}`}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
            counts={categoryCounts}
          />
        </div>

        {usingPreview && <DemoContentNotice className="mt-12" message={previewMessage} />}

        <div className="mt-14 rounded-[2rem] border border-black/5 bg-white/75 p-4 shadow-sm backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
              <Filter size={18} className="shrink-0 text-black/35" />
              <button
                type="button"
                onClick={() => handleCategorySelect(null)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  !selectedCategory
                    ? 'bg-[var(--color-ink)] text-white'
                    : 'bg-white text-black/50 hover:bg-[var(--color-sand)] hover:text-black/75'
                }`}
              >
                Tutte
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    selectedCategory === category
                      ? 'bg-[var(--color-ink)] text-white'
                      : 'bg-white text-black/50 hover:bg-[var(--color-sand)] hover:text-black/75'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-full border border-black/5 bg-white py-3 pl-10 pr-4 text-sm text-[var(--color-ink)] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-sm text-black/50 md:flex-row md:items-center md:justify-between">
          <p>
            {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? resultSingular : resultPlural}
            {selectedCategory ? ` in ${selectedCategory}` : ''}.
          </p>
          <p>Ordinate per contenuto piu recente o prioritario.</p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <ArticleSkeleton key={item} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-black/5 bg-white p-12 text-center shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-accent-text)]">
              {emptyTitle}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-black/62">
              {emptyDescription}
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12"
          >
            {filteredArticles.map((article, index) => {
              const isFeatured = index === 0;

              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.06, 0.24) }}
                  className={`group overflow-hidden rounded-[2.25rem] border border-black/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                    isFeatured ? 'lg:col-span-8' : 'lg:col-span-4'
                  }`}
                >
                  <Link
                    to={getPublicArticlePath(article)}
                    className={
                      isFeatured ? 'grid h-full md:grid-cols-[1.1fr_0.9fr]' : 'block h-full'
                    }
                  >
                    <div
                      className={`relative overflow-hidden ${
                        isFeatured ? 'min-h-[360px]' : 'aspect-[16/11]'
                      }`}
                    >
                      <OptimizedImage
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/92 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink)] shadow-sm backdrop-blur-md">
                          {article.category}
                        </span>
                        {usingPreview && (
                          <span className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
                            Preview
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`flex h-full flex-col p-7 ${isFeatured ? 'md:p-10' : ''}`}>
                      <div className="mb-5 flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-black/35">
                        <span>{formatDateValue(article.createdAt) || 'In evidenza'}</span>
                        <span className="h-1 w-1 rounded-full bg-black/12" />
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={12} className="text-[var(--color-accent)]" />
                          {article.readTime || '5 min'}
                        </span>
                      </div>

                      <h2
                        className={`font-serif leading-tight transition-colors group-hover:text-[var(--color-accent-text)] ${
                          isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl'
                        }`}
                      >
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-black/58">
                          {article.excerpt}
                        </p>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[10px] font-bold uppercase tracking-[0.22em] text-black/42 transition-colors group-hover:text-[var(--color-accent-text)]">
                        {cardCta}
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        <div className="mt-24">
          <Newsletter variant="editorial" source={newsletterSource} />
        </div>

        <div className="mt-16">
          <FinalCtaSection intent="discovery" />
        </div>
      </Section>

      <Section className="!py-0 !pb-16">
        <Newsletter variant="sand" />
      </Section>
    </PageLayout>
  );
}
