import type { ReactNode } from 'react';

interface DropCapProps {
  firstChar: string;
  rest: ReactNode;
}

export default function DropCap({ firstChar, rest }: DropCapProps) {
  return (
    <p className="mt-5 text-[17px] md:text-lg leading-[1.65] md:leading-[1.7] text-[var(--color-ink-2)]">
      <span className="drop-cap">{firstChar}</span>
      {rest}
    </p>
  );
}
