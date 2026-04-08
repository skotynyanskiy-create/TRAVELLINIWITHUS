import Skeleton from './Skeleton';

export default function ListSkeleton() {
  return (
    <div className="divide-y divide-zinc-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-6 flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="w-1/3 h-6 mb-2" />
            <Skeleton className="w-1/4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
