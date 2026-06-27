import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Link } from '@/src/components/TransitionLink';
import { trackEvent } from '../services/analytics';
import MagneticWrapper from './MagneticWrapper';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  to?: string;
  href?: string;
  rel?: string;
  target?: React.HTMLAttributeAnchorTarget;
  type?: 'button' | 'submit' | 'reset';
  /** Granular CTA tracking id. When set, fires `cta_click` event with id + location. */
  trackingId?: string;
  /** Apply subtle magnetic pointer attraction (premium CTAs only). */
  magnetic?: boolean;
  /** Disable the button interaction and visual state. */
  disabled?: boolean;
}

/**
 * A reusable button component that supports different variants, sizes, and navigation types.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  to,
  href,
  rel,
  target,
  type = 'button',
  trackingId,
  magnetic = false,
  disabled = false,
}: ButtonProps) {
  const location = useLocation();
  const fireTracking = () => {
    if (trackingId) {
      trackEvent('cta_click', { id: trackingId, location: location.pathname });
    }
  };

  const handleAnchorClick: React.MouseEventHandler<HTMLElement> = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    fireTracking();
    onClick?.(event);
  };

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    fireTracking();
    onClick?.(event);
  };
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-center font-semibold tracking-normal transition-all ease-out duration-200 whitespace-normal sm:whitespace-nowrap';

  const variants = {
    primary:
      'bg-[var(--color-ink)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-ink-2)] hover:shadow-[var(--shadow-md)]',
    secondary:
      'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-ink-2)]',
    outline:
      'bg-transparent border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-surface-2)]',
    'outline-light':
      'bg-white/5 border border-white/30 text-white backdrop-blur-sm hover:bg-white hover:text-[var(--color-ink)] hover:border-white',
    cta: 'bg-[var(--color-accent)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-md)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-sm md:text-base',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`;

  const wrap = (node: React.ReactNode) =>
    magnetic && !disabled ? <MagneticWrapper>{node}</MagneticWrapper> : node;

  if (to) {
    return wrap(
      <motion.div whileTap={disabled ? undefined : { scale: 0.98 }} className="inline-block">
        <Link to={disabled ? '#' : to} onClick={handleAnchorClick} className={combinedStyles}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return wrap(
      <motion.a
        whileTap={disabled ? undefined : { scale: 0.98 }}
        href={disabled ? undefined : href}
        onClick={handleAnchorClick}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        className={combinedStyles}
      >
        {children}
      </motion.a>
    );
  }

  return wrap(
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={handleButtonClick}
      type={type}
      disabled={disabled}
      className={combinedStyles}
    >
      {children}
    </motion.button>
  );
}
