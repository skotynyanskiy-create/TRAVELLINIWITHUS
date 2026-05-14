import Skeleton from './Skeleton';

export default function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] shadow-sm flex flex-col h-full">
      <div className="aspect-[16/10] w-full">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Skeleton className="w-20 h-3 mb-4" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-6" />
        <div className="mt-auto">
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    </div>
  );
}
