import { useLocation } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from './JsonLd';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  /**
   * Se emettere il JSON-LD `BreadcrumbList`. Default `true`.
   *
   * **Va messo a `false` sulle pagine che passano gia' `breadcrumbs` a `SEO`**,
   * perche' quello e' un secondo emettitore: misurato il 2026-08-15, sette
   * template ne dichiaravano due per pagina — e le due liste non coincidevano
   * nemmeno (questa parte da Home, quella di `SEO` dipende dalla prop). Fra
   * quei sette c'erano `/posto/:slug` e `/articolo/:slug`, cioe' i template che
   * generano quasi tutte le pagine del sito: un albero di breadcrumb
   * contraddittorio, moltiplicato per 79 schede.
   *
   * Il flag e' esplicito e non automatico apposta: il componente non puo'
   * sapere cosa ha dichiarato `SEO`, e indovinarlo con un contesto globale
   * costerebbe piu' della riga che si scrive qui.
   */
  schema?: boolean;
}

export default function Breadcrumbs({ items, className, schema = true }: BreadcrumbsProps) {
  const location = useLocation();
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://travelliniwithus.it';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: origin + '/',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? origin + item.href : origin + location.pathname,
      })),
    ],
  };

  return (
    <>
      {schema && <JsonLd data={breadcrumbSchema} />}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-[11px] uppercase tracking-[0.18em] font-semibold text-black/65 mb-8 whitespace-nowrap overflow-hidden pb-2 ${className ?? ''}`}
      >
        <ol className="flex items-center space-x-2 min-w-0">
          <li className="shrink-0">
            <Link
              to="/"
              className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 py-1.5"
            >
              <Home size={14} />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={item.label}
                className={`flex items-center space-x-2 ${isLast ? 'min-w-0' : 'shrink-0'}`}
              >
                <ChevronRight size={14} className="text-black/30 shrink-0" />
                {isLast || !item.href ? (
                  <span
                    className={`text-black/80 ${isLast ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="inline-block py-1.5 hover:text-[var(--color-accent)] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
