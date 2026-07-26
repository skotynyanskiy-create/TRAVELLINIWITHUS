import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
}

export const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const directionOffset = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
    none: { x: 0, y: 0 },
  }[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface HairlineTraceProps {
  className?: string;
  delay?: number;
}

export const HairlineTrace: React.FC<HairlineTraceProps> = ({ className = '', delay = 0.1 }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={`h-[1px] bg-stone-300 dark:bg-stone-700 w-full ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden h-[1px] w-full ${className}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        className="h-full w-full bg-stone-300 dark:bg-stone-700 origin-left"
      />
    </div>
  );
};

interface EditorialKickerProps {
  kicker: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const EditorialKicker: React.FC<EditorialKickerProps> = ({
  kicker,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-500">
          {kicker}
        </span>
        <HairlineTrace className="max-w-[120px]" />
      </div>
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 dark:text-stone-100">
        {title}
      </h2>
      {subtitle && (
        <p className="font-serif text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
