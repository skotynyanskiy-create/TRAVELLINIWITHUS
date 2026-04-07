import Skeleton from './Skeleton';

export default function ClubSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-sand)] pt-32 pb-24 px-4" aria-busy="true">
      <div className="max-w-lg w-full mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-black/5">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="w-48 h-8 rounded" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
          <Skeleton className="w-40 h-12 rounded-full mt-4" />
        </div>
      </div>
    </div>
  );
}
