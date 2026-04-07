import Skeleton from './Skeleton';

export default function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-sand pt-32" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="w-12 h-3" />
          <Skeleton className="w-3 h-3" />
          <Skeleton className="w-24 h-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Image */}
          <div className="lg:col-span-7">
            <Skeleton className="w-full aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5] rounded-3xl" />
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-6 py-4">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-3/4 h-10 rounded" />
            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-11/12 h-4" />
              <Skeleton className="w-4/5 h-4" />
            </div>

            <div className="space-y-4 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                  <Skeleton className="w-full h-3" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-black/5 mt-auto">
              <Skeleton className="w-20 h-8 rounded" />
              <Skeleton className="flex-1 h-14 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
