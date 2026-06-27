import { lazy, Suspense, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  X,
  MapPin,
  Map as MapIcon,
  Utensils,
  Hotel,
  Eye,
  Building2,
  Landmark,
  CalendarDays,
  Sparkles,
  Clock,
  Download,
  FileDown,
  Loader2,
  RotateCw,
  GripVertical,
} from 'lucide-react';
import { trackEvent } from '../services/analytics';
import {
  POI_CATALOG,
  POI_CATEGORY_LABELS,
  getPoisByDestination,
  type Poi,
  type PoiCategory,
} from '../config/poiCatalog';
import { DESTINATION_BASELINES } from '../config/costBaselines';
import { CONTACTS, SITE_URL } from '../config/site';

// Lazy import della mappa Mapbox: ~150KB gz, caricata solo se l'utente
// apre la sezione "Vedi su mappa".
const ItineraryMap = lazy(() => import('./ItineraryMap'));

const CATEGORY_ICON: Record<PoiCategory, React.ComponentType<{ size?: number }>> = {
  mare: MapPin,
  ristorante: Utensils,
  hotel: Hotel,
  vista: Eye,
  borgo: Building2,
  museo: Landmark,
  evento: CalendarDays,
  esperienza: Sparkles,
};

/**
 * SortableItem — singolo POI nel piano del giorno, drag handle + remove.
 *
 * Marathon FASE 3.A drag&drop 2026-05-18.
 * useSortable da @dnd-kit/sortable wrappa il list item con keyboard a11y
 * automatica + smooth transform durante drag.
 */
interface SortableItemProps {
  poi: Poi;
  poiId: string;
  idx: number;
  activeDay: number;
  onRemove: (day: number, poiId: string) => void;
}

function SortablePoiItem({ poi, poiId, idx, activeDay, onRemove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: poiId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const Icon = CATEGORY_ICON[poi.category];

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 rounded-[var(--radius-md)] border bg-white px-4 py-3 transition-shadow ${
        isDragging
          ? 'border-[var(--color-ink)] shadow-[var(--shadow-md)] cursor-grabbing'
          : 'border-black/8'
      }`}
    >
      {/* Drag handle dedicato (a11y: button con listeners) */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Riordina ${poi.name}`}
        className="-ml-1 flex h-8 w-6 shrink-0 cursor-grab items-center justify-center text-black/30 transition-colors hover:text-[var(--color-ink)] active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </button>

      <span className="dispatch-index-number !min-w-[2rem]">
        {String(idx + 1).padStart(2, '0')}
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-sand)] text-[var(--color-ink)]">
        <Icon size={13} />
      </span>
      <span className="flex-1">
        <span className="block font-serif text-base leading-snug">{poi.name}</span>
        <span className="mt-1 block text-eyebrow !text-black/55">
          {POI_CATEGORY_LABELS[poi.category]} · {Math.round((poi.durationMin / 60) * 10) / 10}h
        </span>
      </span>
      <button
        type="button"
        onClick={() => onRemove(activeDay, poiId)}
        aria-label={`Rimuovi ${poi.name} dal Giorno ${activeDay}`}
        className="text-black/30 transition-colors hover:text-[var(--color-ink)]"
      >
        <X size={16} />
      </button>
    </li>
  );
}

interface ItineraryBuilderProps {
  source?: string;
  /** Destinazione iniziale */
  initialDestSlug?: string;
  /** Numero giorni iniziale (2-10) */
  initialDays?: number;
}

interface PlannedDay {
  /** Numero del giorno 1-N */
  day: number;
  /** Array POI id per quel giorno (ordine = visita sequenziale) */
  poiIds: string[];
}

/**
 * ItineraryBuilder — MVP click-to-add itinerario di N giorni.
 *
 * Marathon FASE 3.A 2026-05-18 (MVP).
 *
 * Layout:
 * - Header: selettore destinazione + slider giorni
 * - Sinistra: lista POI filtrabile per categoria
 * - Destra: tabella giorni con slot per POI aggiunti, drag pseudo-numerico
 *
 * MVP behavior:
 * - Click su POI → si aggiunge al giorno "attivo" (selezionato in sidebar)
 * - Click su POI in giorno → rimuove
 * - Pulsanti "Sposta su" / "Sposta giu" per riordinare (no dnd-kit ancora)
 * - Export PDF / share = stretch goal sessione futura
 *
 * Persist: localStorage `tw_itinerary_{dest}` con piano + giorni. Quando
 * l'utente torna ritrova l'itinerario.
 *
 * Roadmap drag&drop: aggiungere @dnd-kit/core quando adoption MVP > soglia
 * (cambia handleAddPoi → handleDragEnd, resto componente invariato).
 */
export default function ItineraryBuilder({
  source = 'itinerary_builder',
  initialDestSlug = 'salento',
  initialDays = 4,
}: ItineraryBuilderProps) {
  const destinations = useMemo(() => Object.values(DESTINATION_BASELINES), []);
  const [destSlug, setDestSlug] = useState(initialDestSlug);
  const [days, setDays] = useState(initialDays);
  const [categoryFilter, setCategoryFilter] = useState<PoiCategory | 'all'>('all');
  const [activeDay, setActiveDay] = useState(1);

  // Plan state: array di PlannedDay sincronizzato col numero giorni.
  const [plan, setPlan] = useState<PlannedDay[]>(
    Array.from({ length: initialDays }, (_, i) => ({ day: i + 1, poiIds: [] }))
  );

  // Sync plan length con days quando cambia.
  // Adjust-during-render React 19 (no useEffect setState).
  const [prevDays, setPrevDays] = useState(initialDays);
  if (days !== prevDays) {
    setPrevDays(days);
    setPlan((prev) => {
      if (days > prev.length) {
        // Aggiungi giorni vuoti.
        return [
          ...prev,
          ...Array.from({ length: days - prev.length }, (_, i) => ({
            day: prev.length + i + 1,
            poiIds: [],
          })),
        ];
      }
      // Tronca giorni in piu (preserva POI dei primi N giorni).
      return prev.slice(0, days);
    });
    if (activeDay > days) setActiveDay(days);
  }

  // Sync destinazione: reset plan quando cambia destinazione (POI diversi).
  const [prevDestSlug, setPrevDestSlug] = useState(initialDestSlug);
  if (destSlug !== prevDestSlug) {
    setPrevDestSlug(destSlug);
    setPlan(Array.from({ length: days }, (_, i) => ({ day: i + 1, poiIds: [] })));
    setActiveDay(1);
  }

  const availablePois = useMemo(() => getPoisByDestination(destSlug), [destSlug]);
  const filteredPois = useMemo(() => {
    if (categoryFilter === 'all') return availablePois;
    return availablePois.filter((p) => p.category === categoryFilter);
  }, [availablePois, categoryFilter]);

  const usedPoiIds = useMemo(() => {
    const ids = new Set<string>();
    plan.forEach((d) => d.poiIds.forEach((id) => ids.add(id)));
    return ids;
  }, [plan]);

  const totalMinutes = useMemo(() => {
    return plan.map((day) => ({
      day: day.day,
      minutes: day.poiIds.reduce((sum, id) => {
        const poi = POI_CATALOG[id];
        return sum + (poi?.durationMin ?? 0);
      }, 0),
    }));
  }, [plan]);

  const handleAddPoi = (poi: Poi) => {
    if (usedPoiIds.has(poi.id)) return; // gia in itinerario
    setPlan((prev) =>
      prev.map((d) => (d.day === activeDay ? { ...d, poiIds: [...d.poiIds, poi.id] } : d))
    );
    trackEvent('itinerary_poi_add', {
      destination: destSlug,
      poi_id: poi.id,
      poi_category: poi.category,
      day: activeDay,
      source,
    });
  };

  const handleRemovePoi = (day: number, poiId: string) => {
    setPlan((prev) =>
      prev.map((d) => (d.day === day ? { ...d, poiIds: d.poiIds.filter((id) => id !== poiId) } : d))
    );
    trackEvent('itinerary_poi_remove', { destination: destSlug, poi_id: poiId, day });
  };

  const handleReset = () => {
    setPlan(Array.from({ length: days }, (_, i) => ({ day: i + 1, poiIds: [] })));
    setActiveDay(1);
    trackEvent('itinerary_reset', { destination: destSlug });
  };

  // Drag&drop sensors: pointer + keyboard (a11y nativa).
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // evita drag accidentale al click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlan((prev) =>
      prev.map((d) => {
        if (d.day !== activeDay) return d;
        const oldIndex = d.poiIds.indexOf(String(active.id));
        const newIndex = d.poiIds.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) return d;
        return { ...d, poiIds: arrayMove(d.poiIds, oldIndex, newIndex) };
      })
    );
    trackEvent('itinerary_poi_reorder', {
      destination: destSlug,
      day: activeDay,
      from_poi: String(active.id),
      to_poi: String(over.id),
    });
  };

  const [pdfBuilding, setPdfBuilding] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleToggleMap = () => {
    setShowMap((prev) => {
      const next = !prev;
      if (next) {
        trackEvent('itinerary_map_open', { destination: destSlug, day: activeDay });
      }
      return next;
    });
  };

  const handleExportPdf = async () => {
    if (pdfBuilding) return;
    setPdfBuilding(true);
    trackEvent('itinerary_export_pdf_start', { destination: destSlug, days });

    try {
      // Lazy import @react-pdf/renderer per evitare di gonfiare il bundle
      // delle pagine che non usano l'export PDF.
      const [{ pdf }, ItineraryDocumentModule] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../pdf/ItineraryDocument'),
      ]);
      const ItineraryDocument = ItineraryDocumentModule.default;

      // Mappa il piano interno al formato richiesto dal componente PDF.
      const destinationName = DESTINATION_BASELINES[destSlug]?.name ?? destSlug;
      const pdfDays = plan.map((day) => {
        const pois = day.poiIds
          .map((id) => POI_CATALOG[id])
          .filter((poi): poi is Poi => poi !== undefined)
          .map((poi, idx) => ({
            number: String(idx + 1).padStart(2, '0'),
            name: poi.name,
            category: POI_CATEGORY_LABELS[poi.category],
            durationMin: poi.durationMin,
            description: poi.description,
            rbNote: poi.rbNote,
          }));
        const totalHours = pois.reduce((sum, p) => sum + p.durationMin / 60, 0);
        return { day: day.day, totalHours, pois };
      });

      const blob = await pdf(
        <ItineraryDocument
          destinationName={destinationName}
          daysCount={days}
          generatedAt={new Date().toISOString()}
          days={pdfDays}
          contacts={{
            instagram: CONTACTS.instagramHandle,
            tiktok: CONTACTS.tiktokHandle,
            website: SITE_URL,
          }}
        />
      ).toBlob();

      // Trigger download nel browser via blob URL.
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeSlug = destSlug.replace(/[^a-z0-9-]/g, '');
      link.download = `itinerario-${safeSlug}-${days}gg.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Revoke dopo un tick per dare tempo al download di partire.
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      trackEvent('itinerary_export_pdf_success', {
        destination: destSlug,
        days,
        total_pois: pdfDays.reduce((sum, d) => sum + d.pois.length, 0),
      });
    } catch (err) {
      console.error('PDF export failed:', err);
      trackEvent('itinerary_export_pdf_error', { destination: destSlug });
    } finally {
      setPdfBuilding(false);
    }
  };

  const handleExportCopy = async () => {
    // Export testo in clipboard (fallback rapido senza PDF).
    const lines: string[] = [
      `Itinerario ${DESTINATION_BASELINES[destSlug]?.name ?? destSlug} — ${days} giorni`,
      'Travelliniwithus · itinerario auto-composto',
      '',
    ];
    plan.forEach((day) => {
      lines.push(`Giorno ${day.day}`);
      if (day.poiIds.length === 0) {
        lines.push('  (vuoto)');
      } else {
        day.poiIds.forEach((id) => {
          const poi = POI_CATALOG[id];
          if (poi) {
            lines.push(
              `  · ${poi.name} — ${POI_CATEGORY_LABELS[poi.category]} (${poi.durationMin} min)`
            );
            if (poi.rbNote) lines.push(`     R+B: ${poi.rbNote}`);
          }
        });
      }
      lines.push('');
    });
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      trackEvent('itinerary_export_copy', { destination: destSlug, days });
    } catch {
      // Clipboard non disponibile, fallback: log e basta.
    }
  };

  const hasAnyPoi = plan.some((d) => d.poiIds.length > 0);

  return (
    <div className="rounded-[var(--radius-xl)] border border-black/8 bg-white p-8 shadow-[var(--shadow-md)] md:p-12">
      {/* Header */}
      <div className="mb-10">
        <span className="text-eyebrow inline-flex items-center gap-2">
          <CalendarDays size={14} /> Costruttore itinerario
        </span>
        <h2 className="mt-5 font-serif font-medium leading-[1.1] tracking-tight text-[var(--color-ink)] text-[clamp(1.75rem,3vw+0.5rem,2.75rem)]">
          Costruisci il tuo itinerario,
          <br />
          <span className="italic text-black/55">su tappe che abbiamo provato.</span>
        </h2>
        <p className="mt-5 text-body-editorial">
          Catalogo curato a mano da R+B. Clicca per aggiungere una tappa al giorno attivo. Versione
          beta — drag&apos;n&apos;drop e export PDF in arrivo.
        </p>
      </div>

      {/* Top controls: destinazione + giorni */}
      <div className="mb-10 grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-eyebrow block mb-3" htmlFor="ib-dest">
            Destinazione
          </label>
          <select
            id="ib-dest"
            value={destSlug}
            onChange={(e) => setDestSlug(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-black/12 bg-white px-5 py-3.5 font-serif text-lg text-[var(--color-ink)] focus:border-[var(--color-ink)] focus:outline-none"
          >
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-eyebrow flex justify-between mb-3" htmlFor="ib-days">
            <span>Quanti giorni</span>
            <span className="text-[var(--color-ink)]">
              {days} {days === 1 ? 'giorno' : 'giorni'}
            </span>
          </label>
          <input
            id="ib-days"
            type="range"
            min={2}
            max={10}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-[var(--color-ink)]"
          />
        </div>
      </div>

      {/* Avvertenza se nessun POI disponibile */}
      {availablePois.length === 0 && (
        <div className="mb-8 rounded-[var(--radius-md)] border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-5">
          <p className="text-sm leading-snug text-[var(--color-ink)]">
            <strong>{DESTINATION_BASELINES[destSlug]?.name}</strong> non ha ancora tappe nel
            catalogo. Stiamo costruendo i POI per ogni destinazione — comincia con Salento, dove
            abbiamo già 10 tappe vere.
          </p>
        </div>
      )}

      {availablePois.length > 0 && (
        <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr]">
          {/* Sinistra: catalogo POI */}
          <section aria-label="Tappe disponibili">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-eyebrow">Tappe disponibili ({filteredPois.length})</span>
            </div>

            {/* Filtri categoria */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                aria-pressed={categoryFilter === 'all'}
                className={`rounded-full border px-4 py-1.5 text-eyebrow transition-all ${
                  categoryFilter === 'all'
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] !text-white'
                    : 'border-black/12 bg-white hover:border-black/30'
                }`}
              >
                Tutte
              </button>
              {(Object.keys(POI_CATEGORY_LABELS) as PoiCategory[])
                .filter((cat) => availablePois.some((p) => p.category === cat))
                .map((cat) => {
                  const Icon = CATEGORY_ICON[cat];
                  const isActive = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-eyebrow transition-all ${
                        isActive
                          ? 'border-[var(--color-ink)] bg-[var(--color-ink)] !text-white'
                          : 'border-black/12 bg-white hover:border-black/30'
                      }`}
                    >
                      <Icon size={11} />
                      {POI_CATEGORY_LABELS[cat]}
                    </button>
                  );
                })}
            </div>

            {/* Lista POI */}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredPois.map((poi) => {
                  const Icon = CATEGORY_ICON[poi.category];
                  const isUsed = usedPoiIds.has(poi.id);
                  return (
                    <motion.button
                      key={poi.id}
                      type="button"
                      onClick={() => handleAddPoi(poi)}
                      disabled={isUsed}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`group flex w-full items-start gap-4 rounded-[var(--radius-md)] border px-5 py-4 text-left transition-all duration-300 ${
                        isUsed
                          ? 'cursor-not-allowed border-black/5 bg-[var(--color-sand)] opacity-50'
                          : 'border-black/10 bg-white hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:shadow-[var(--shadow-sm)]'
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-sand)] text-[var(--color-ink)]">
                        <Icon size={15} />
                      </span>
                      <span className="flex-1">
                        <span className="text-eyebrow block">
                          {POI_CATEGORY_LABELS[poi.category]}
                        </span>
                        <span className="mt-1 block font-serif text-lg leading-snug">
                          {poi.name}
                        </span>
                        <span className="mt-1.5 block text-sm leading-snug text-black/65">
                          {poi.description}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-eyebrow !text-black/45">
                          <Clock size={11} />{' '}
                          {poi.durationMin >= 60
                            ? `${Math.round((poi.durationMin / 60) * 10) / 10}h`
                            : `${poi.durationMin}m`}
                        </span>
                      </span>
                      {!isUsed ? (
                        <Plus
                          size={18}
                          className="mt-1 shrink-0 text-black/30 transition-colors group-hover:text-[var(--color-ink)]"
                        />
                      ) : (
                        <span className="text-eyebrow shrink-0">Aggiunto</span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Destra: piano per giorno */}
          <section aria-label="Piano per giorno">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-eyebrow">Il vostro piano</span>
              {hasAnyPoi && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-eyebrow !text-black/55 transition-colors hover:!text-[var(--color-ink)]"
                >
                  <RotateCw size={12} /> Reset
                </button>
              )}
            </div>

            {/* Tabs giorni */}
            <div className="mb-5 flex flex-wrap gap-2">
              {plan.map((day) => {
                const isActive = activeDay === day.day;
                const count = day.poiIds.length;
                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setActiveDay(day.day)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-eyebrow transition-all ${
                      isActive
                        ? 'border-[var(--color-ink)] bg-[var(--color-ink)] !text-white'
                        : 'border-black/12 bg-white hover:border-black/30'
                    }`}
                  >
                    Giorno {day.day}
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium ${
                        isActive ? 'bg-white/20' : 'bg-black/5'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Giorno attivo: lista POI */}
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-sand)] p-6 md:p-8">
              <div className="mb-5 flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-2xl leading-tight text-[var(--color-ink)]">
                  Giorno {activeDay}
                </h3>
                {totalMinutes.find((d) => d.day === activeDay)?.minutes ? (
                  <span className="text-eyebrow">
                    {Math.round((totalMinutes.find((d) => d.day === activeDay)?.minutes ?? 0) / 60)}
                    h totali
                  </span>
                ) : null}
              </div>

              {plan.find((d) => d.day === activeDay)?.poiIds.length === 0 ? (
                <p className="text-body-editorial italic text-black/55">
                  Nessuna tappa per oggi. Clicca un POI dalla lista a sinistra per aggiungerlo. Una
                  volta aggiunto, trascina per riordinare.
                </p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={plan.find((d) => d.day === activeDay)?.poiIds ?? []}
                    strategy={verticalListSortingStrategy}
                  >
                    <ol className="space-y-3">
                      {plan
                        .find((d) => d.day === activeDay)
                        ?.poiIds.map((poiId, idx) => {
                          const poi = POI_CATALOG[poiId];
                          if (!poi) return null;
                          return (
                            <SortablePoiItem
                              key={poiId}
                              poi={poi}
                              poiId={poiId}
                              idx={idx}
                              activeDay={activeDay}
                              onRemove={handleRemovePoi}
                            />
                          );
                        })}
                    </ol>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Mappa giorno attivo (lazy load) */}
            {hasAnyPoi && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleToggleMap}
                  aria-expanded={showMap}
                  className="inline-flex items-center gap-2 text-eyebrow text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                >
                  <MapIcon size={13} />
                  {showMap ? 'Nascondi mappa' : 'Vedi le tappe del giorno su mappa'}
                </button>

                <AnimatePresence initial={false}>
                  {showMap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-4 overflow-hidden"
                    >
                      <Suspense
                        fallback={
                          <div className="flex h-[440px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-sand)]">
                            <Loader2 size={18} className="animate-spin text-black/40" />
                          </div>
                        }
                      >
                        <ItineraryMap
                          poiIds={plan.find((d) => d.day === activeDay)?.poiIds ?? []}
                          day={activeDay}
                        />
                      </Suspense>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Export */}
            {hasAnyPoi && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={pdfBuilding}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-eyebrow !text-white transition-colors hover:bg-[var(--color-accent)] disabled:opacity-60"
                >
                  {pdfBuilding ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Generazione PDF...
                    </>
                  ) : (
                    <>
                      <FileDown size={13} /> Scarica PDF brand
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleExportCopy}
                  disabled={pdfBuilding}
                  className="inline-flex items-center gap-2 rounded-full border border-black/12 bg-white px-5 py-3 text-eyebrow text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] disabled:opacity-60"
                >
                  <Download size={13} /> Copia testo
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
