import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from './JsonLd';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://travelliniwithus.it';

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
      <JsonLd data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className={`flex items-center text-xs uppercase tracking-widest font-semibold text-black/50 mb-8 overflow-x-auto whitespace-nowrap pb-2 ${className ?? ''}`}>
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
              <Home size={14} />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center space-x-2">
                <ChevronRight size={14} className="text-black/30" />
                {isLast || !item.href ? (
                  <span className="text-black/80" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.href} className="hover:text-[var(--color-accent)] transition-colors">
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
