import Skeleton from './Skeleton';

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col h-full border border-black/5">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-6 left-6">
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <Skeleton className="w-3/4 h-8 mb-4" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-5/6 h-4 mb-8" />
        
        <ul className="space-y-3 mb-10 flex-grow">
          <li className="flex items-center gap-3"><Skeleton className="w-4 h-4 rounded-full shrink-0" /><Skeleton className="w-full h-3" /></li>
          <li className="flex items-center gap-3"><Skeleton className="w-4 h-4 rounded-full shrink-0" /><Skeleton className="w-4/5 h-3" /></li>
          <li className="flex items-center gap-3"><Skeleton className="w-4 h-4 rounded-full shrink-0" /><Skeleton className="w-5/6 h-3" /></li>
        </ul>
        
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-black/5">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-16 h-6" />
          </div>
          <Skeleton className="flex-1 h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
