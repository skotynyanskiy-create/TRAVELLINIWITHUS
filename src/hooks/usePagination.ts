import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number, resetKey?: unknown) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  let page = currentPage;
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setCurrentPage(1);
    page = 1;
  }

  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, safePage, itemsPerPage]);

  return { currentPage: safePage, setCurrentPage, totalPages, paginated };
}
