import Skeleton from './Skeleton';

interface ArticleSkeletonProps {
  /** Default 'shimmer' — più editoriale; 'pulse' per legacy compat. */
  variant?: 'pulse' | 'shimmer';
}

export default function ArticleSkeleton({ variant = 'shimmer' }: ArticleSkeletonProps) {
  return (
    <div className="bg-white rounded-[var(--radius-xl)] overflow-hidden border border-black/5 shadow-sm flex flex-col h-full">
      <div className="aspect-[16/10] w-full">
        <Skeleton variant={variant} className="w-full h-full rounded-none" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Skeleton variant={variant} className="w-20 h-3 mb-4" />
        <Skeleton variant={variant} className="w-full h-6 mb-2" />
        <Skeleton variant={variant} className="w-3/4 h-6 mb-6" />
        <div className="mt-auto">
          <Skeleton variant={variant} className="w-32 h-4" />
        </div>
      </div>
    </div>
  );
}
