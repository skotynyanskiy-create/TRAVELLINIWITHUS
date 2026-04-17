import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    bounce: 0,
    duration: duration,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, springValue, value]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  // Format large numbers (e.g. 167000 -> 167K if needed, but here we just animate the base and append suffix)
  const formattedValue =
    displayValue >= 1000 && value >= 1000 && !suffix.includes('K')
      ? displayValue.toLocaleString('it-IT')
      : displayValue.toString();

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
}
