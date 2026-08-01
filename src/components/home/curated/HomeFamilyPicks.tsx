import { ArrowRight } from 'lucide-react';
import { Link } from '@/src/components/TransitionLink';
import Section from '@/src/components/Section';
import FamilyEntryCard from '@/src/components/family/FamilyEntryCard';
import { getFamilyEntries } from '@/src/config/familyLibrary';

/**
 * I consigli family in home, quando l'audience e' family.
 *
 * Riusa `FamilyEntryCard` — la stessa riga editoriale di `/family/consigli` —
 * invece di inventare una card nuova: chi arriva dalla home e poi apre la
 * sezione deve riconoscere la stessa cosa, non due linguaggi diversi.
 *
 * `getFamilyEntries()` filtra gia' i placeholder: qui non esiste il caso
 * "scheda vuota", e se un giorno il seed si svuota la sezione sparisce da sola
 * invece di mostrare una griglia di buchi.
 */
const HOME_LIMIT = 3;

export default function HomeFamilyPicks() {
  const entries = getFamilyEntries().slice(0, HOME_LIMIT);
  if (entries.length === 0) return null;

  const total = getFamilyEntries().length;

  return (
    <Section
      id="family-picks"
      title="Quello che ci saremmo voluti sentir dire prima di partire."
      subtitle="Consigli presi dai nostri viaggi con la famiglia, non da una guida."
      align="left"
    >
      <div className="grid gap-6">
        {entries.map((entry, index) => (
          <FamilyEntryCard key={entry.id} entry={entry} priority={index === 0} />
        ))}
      </div>

      {total > HOME_LIMIT && (
        <Link
          to="/family/consigli"
          className="group mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)] underline-offset-4 hover:underline"
        >
          Tutti i {total} consigli
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </Section>
  );
}
