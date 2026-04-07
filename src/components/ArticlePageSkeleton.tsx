import Skeleton from './Skeleton';

export default function ArticlePageSkeleton() {
  return (
    <div aria-busy="true">
      {/* Hero skeleton */}
      <div className="relative h-[70vh] md:h-[85vh] w-full bg-zinc-200 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-20 left-0 right-0 px-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-28 h-7 rounded-full" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
          <Skeleton className="w-3/4 h-12 md:h-16 mb-4 rounded bg-white/20" />
          <Skeleton className="w-1/2 h-12 md:h-16 mb-8 rounded bg-white/20" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
            <Skeleton className="w-40 h-4 rounded bg-white/20" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
        <div className="space-y-6">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-11/12 h-5" />
          <Skeleton className="w-4/5 h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-3/4 h-5" />
          <div className="pt-6" />
          <Skeleton className="w-2/3 h-8 rounded" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-11/12 h-5" />
          <Skeleton className="w-5/6 h-5" />
          <Skeleton className="w-full h-5" />
        </div>

        <aside className="hidden lg:flex flex-col gap-6">
          <Skeleton className="w-full h-48 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
        </aside>
      </div>
    </div>
  );
}
