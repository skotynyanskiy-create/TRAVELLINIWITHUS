import { useAudience } from '../context/AudienceContext';
import { AUDIENCE_EDITIONS } from '../config/audienceEditions';

/**
 * Pallino accent accanto al marchio: dichiara di che edizione è il sito senza
 * aggiungere un controllo. `--color-accent` è ridefinito per audience
 * (index.css `:root[data-audience=...]`) — è letteralmente il colore che il
 * sito è appena diventato.
 *
 * Prima era un chip interattivo a tre gradini (pallino sotto md, pallino+
 * parola md–lg, popover ≥lg). Con la fascia di edizione in Navbar (riga 2)
 * il lavoro di "che edizione è" e "cambia edizione" è suo, ad ogni larghezza
 * — quindi il chip si ritira e resta solo il pallino, permanente.
 */
export default function AudienceEditionChip() {
  const { audience } = useAudience();
  const current =
    AUDIENCE_EDITIONS.find((choice) => choice.key === audience) ?? AUDIENCE_EDITIONS[0];

  return (
    <span className="flex shrink-0 items-center" aria-hidden="true">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
      <span className="sr-only">Edizione {current.title}</span>
    </span>
  );
}
