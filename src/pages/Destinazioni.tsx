import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import JsonLd from '../components/JsonLd';
import PageLayout from '../components/PageLayout';
import Section from '../components/Section';
import SEO from '../components/SEO';
import DestinationHero from '../components/destinazioni/DestinationHero';
import DestinationFilters, {
  GROUP_VISUALS,
} from '../components/destinazioni/DestinationFilters';
import DestinationGrid from '../components/destinazioni/DestinationGrid';
import DestinationFooter from '../components/destinazioni/DestinationFooter';
import { DEMO_DESTINATION_CARD } from '../config/demoContent';
import { PREVIEW_ARTICLES, PREVIEW_EXPERIENCE_TYPES } from '../config/previewContent';
import { getExperienceTypeFromQuery } from '../config/contentTaxonomy';
import { siteContentDefaults } from '../config/siteContent';
import { SITE_URL } from '../config/site';
import { useSiteContent } from '../hooks/useSiteContent';
import { fetchArticles } from '../services/firebaseService';
import {
  mapArticleToArchiveItem,
  mapPreviewToArchiveItem,
  type ArchiveItem,
} from '../utils/contentArchive';

const ITEMS_PER_PAGE = 6;

function uniqueValues(items: Array<string | undefined>) {
  return Array.from(
    new Set(items.filter((item): item is string => Boolean(item && item !== 'Da definire'))),
  );
}

export default function Destinazioni() {
  const { data: demoContent } = useSiteContent('demo');
  const demoSettings = demoContent ?? siteContentDefaults.demo;
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['destination-archive', demoSettings.showDestinationDemo],
    queryFn: fetchArticles,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const selectedGroup = searchParams.get('group') || searchParams.get('region') || 'Tutti';
  const selectedExperience = getExperienceTypeFromQuery(searchParams.get('type')) || 'Tutti';
  const selectedRegion = searchParams.get('area') || 'Tutti';
  const selectedCity = searchParams.get('city') || 'Tutti';
  const selectedPeriod = searchParams.get('period') || 'Tutti';
  const selectedBudget = searchParams.get('budget') || 'Tutti';
  const selectedDuration = searchParams.get('duration') || 'Tutti';

  const archiveItems = useMemo<ArchiveItem[]>(() => {
    const mapped = articles
      .map(mapArticleToArchiveItem)
      .filter((item) => item.destinationGroup !== 'Altro');

    if (demoSettings.showDestinationDemo) {
      const existingSlugs = new Set(
        mapped.map((item) => item.link.replace(/^\/articolo\//, '')),
      );
      const demoItems = Object.values(PREVIEW_ARTICLES)
        .filter((preview) => !existingSlugs.has(preview.slug))
        .map((preview) =>
          mapPreviewToArchiveItem(preview, PREVIEW_EXPERIENCE_TYPES[preview.slug] ?? []),
        )
        .filter((item) => item.destinationGroup !== 'Altro');
      return [...mapped, ...demoItems];
    }

    if (mapped.length > 0) return mapped;
    return [];
  }, [articles, demoSettings.showDestinationDemo]);

  const availableRegions = useMemo(() => {
    if (selectedGroup !== 'Italia') return ['Tutti'];
    return [
      'Tutti',
      ...uniqueValues(
        archiveItems.filter((item) => item.country === 'Italia').map((item) => item.region),
      ),
    ];
  }, [archiveItems, selectedGroup]);

  const availableCities = useMemo(() => {
    if (selectedGroup !== 'Italia' || selectedRegion === 'Tutti') return ['Tutti'];
    return [
      'Tutti',
      ...uniqueValues(
        archiveItems
          .filter((item) => item.country === 'Italia' && item.region === selectedRegion)
          .map((item) => item.city),
      ),
    ];
  }, [archiveItems, selectedGroup, selectedRegion]);

  const availablePeriods = useMemo(
    () => ['Tutti', ...uniqueValues(archiveItems.map((item) => item.period))],
    [archiveItems],
  );
  const availableBudgets = useMemo(
    () => ['Tutti', ...uniqueValues(archiveItems.map((item) => item.budget))],
    [archiveItems],
  );
  const availableDurations = useMemo(
    () => ['Tutti', ...uniqueValues(archiveItems.map((item) => item.duration))],
    [archiveItems],
  );

  const filteredItems = useMemo(
    () =>
      archiveItems.filter((item) => {
        const matchGroup = selectedGroup === 'Tutti' || item.destinationGroup === selectedGroup;
        const matchExperience =
          selectedExperience === 'Tutti' || item.experienceTypes.includes(selectedExperience);
        const matchRegion = selectedRegion === 'Tutti' || item.region === selectedRegion;
        const matchCity = selectedCity === 'Tutti' || item.city === selectedCity;
        const matchPeriod = selectedPeriod === 'Tutti' || item.period === selectedPeriod;
        const matchBudget = selectedBudget === 'Tutti' || item.budget === selectedBudget;
        const matchDuration = selectedDuration === 'Tutti' || item.duration === selectedDuration;

        return (
          matchGroup &&
          matchExperience &&
          matchRegion &&
          matchCity &&
          matchPeriod &&
          matchBudget &&
          matchDuration
        );
      }),
    [
      archiveItems,
      selectedBudget,
      selectedCity,
      selectedDuration,
      selectedExperience,
      selectedGroup,
      selectedPeriod,
      selectedRegion,
    ],
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const activeGroupImage =
    GROUP_VISUALS[selectedGroup === 'Tutti' ? 'Italia' : selectedGroup] || GROUP_VISUALS.Italia;
  const hasActiveFilters =
    selectedGroup !== 'Tutti' ||
    selectedExperience !== 'Tutti' ||
    selectedRegion !== 'Tutti' ||
    selectedCity !== 'Tutti' ||
    selectedPeriod !== 'Tutti' ||
    selectedBudget !== 'Tutti' ||
    selectedDuration !== 'Tutti';
  const usingDemo =
    archiveItems.length === 1 && archiveItems[0]?.id === DEMO_DESTINATION_CARD.id;

  const updateSearch = (updates: Record<string, string | null>) => {
    setCurrentPage(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (!value || value === 'Tutti') next.delete(key);
          else next.set(key, value);
        });
        return next;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  return (
    <PageLayout>
      <SEO
        title="Destinazioni"
        description="Trova posti particolari da salvare e vivere davvero: destinazioni, regioni, esperienze e guide Travelliniwithus filtrabili con criterio."
        canonical={`${SITE_URL}/destinazioni`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Destinazioni Travelliniwithus',
          url: `${SITE_URL}/destinazioni`,
          description:
            'Archivio editoriale di destinazioni, regioni e posti particolari selezionati da Travelliniwithus.',
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Destinazioni',
                item: `${SITE_URL}/destinazioni`,
              },
            ],
          },
        }}
      />

      <DestinationHero activeGroupImage={activeGroupImage} />

      <Section>
        <DestinationFilters
          archiveItems={archiveItems}
          selectedGroup={selectedGroup}
          selectedExperience={selectedExperience}
          selectedRegion={selectedRegion}
          selectedCity={selectedCity}
          selectedPeriod={selectedPeriod}
          selectedBudget={selectedBudget}
          selectedDuration={selectedDuration}
          availableRegions={availableRegions}
          availableCities={availableCities}
          availablePeriods={availablePeriods}
          availableBudgets={availableBudgets}
          availableDurations={availableDurations}
          hasActiveFilters={hasActiveFilters}
          onUpdate={updateSearch}
          onReset={resetFilters}
        />

        <DestinationGrid
          paginatedItems={paginatedItems}
          filteredCount={filteredItems.length}
          archiveCount={archiveItems.length}
          isLoading={isLoading}
          usingDemo={usingDemo}
          hasActiveFilters={hasActiveFilters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onReset={resetFilters}
        />
      </Section>

      <DestinationFooter />
    </PageLayout>
  );
}
