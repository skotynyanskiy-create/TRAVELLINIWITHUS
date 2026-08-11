import type { ReactNode } from 'react';

/**
 * Paragrafo interno alle direttive (pullquote/source/verified) — bare <p>
 * senza margin/font override del body, eredita lo styling dal wrapper
 * directive. Non e' legato a una singola direttiva: e' condiviso da tutte
 * quelle che marcano i propri paragrafi con `markParagraphsBare`.
 */
export default function DirectiveParagraph({ children }: { children?: ReactNode }) {
  return <p className="[&:not(:first-child)]:mt-3">{children}</p>;
}
