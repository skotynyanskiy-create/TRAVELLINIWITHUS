import Skeleton from './Skeleton';

export default function FormSkeleton() {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <div className="flex justify-between items-center mb-12">
        <Skeleton className="w-1/3 h-10" />
        <Skeleton className="w-24 h-10 rounded-full" />
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-full h-32 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
