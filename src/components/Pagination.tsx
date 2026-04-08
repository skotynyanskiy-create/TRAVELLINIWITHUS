import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-20 flex justify-center items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 h-10 rounded-full border border-[var(--color-ink)]/20 text-[var(--color-ink)]/60 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Pagina precedente"
      >
        <ChevronLeft size={16} /> Precedente
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
            currentPage === page
              ? 'bg-[var(--color-ink)] text-white'
              : 'border border-[var(--color-ink)]/20 text-[var(--color-ink)]/60 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 h-10 rounded-full border border-[var(--color-ink)]/20 text-[var(--color-ink)]/60 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Pagina successiva"
      >
        Successiva <ChevronRight size={16} />
      </button>
    </div>
  );
}
