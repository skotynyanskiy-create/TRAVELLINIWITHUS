import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  /** 'pulse' (default, opacity loop) o 'shimmer' (gradient editoriale L→R) */
  variant?: 'pulse' | 'shimmer';
}

export default function Skeleton({ className = '', variant = 'pulse' }: SkeletonProps) {
  if (variant === 'shimmer') {
    return (
      <div
        className={`relative overflow-hidden rounded-md bg-[var(--color-muted-bg-2)] ${className}`}
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-[var(--color-muted-bg-2)] rounded-md ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
