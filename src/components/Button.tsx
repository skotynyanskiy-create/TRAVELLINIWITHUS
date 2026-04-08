import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * Props for the Button component.
 */
interface ButtonProps {
  /** The content to be displayed inside the button. */
  children: React.ReactNode;
  /** The visual style variant of the button. Defaults to 'primary'. */
  variant?: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'cta';
  /** The size of the button. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes to apply to the button. */
  className?: string;
  /** Callback function to be executed when the button is clicked. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** The path to navigate to if the button is a link. */
  to?: string;
  /** The URL to open if the button is an external link. */
  href?: string;
  /** Rel attribute for external links. */
  rel?: string;
  /** Target attribute for external links. */
  target?: React.HTMLAttributeAnchorTarget;
  /** The HTML type attribute of the button. Defaults to 'button'. */
  type?: 'button' | 'submit' | 'reset';
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
  type = 'button'
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center gap-3 rounded-[var(--radius-xl)] uppercase tracking-widest font-semibold transition-all duration-500 ease-out";
  
  const variants = {
    primary: "bg-[var(--color-ink)] text-white shadow-md hover:bg-[var(--color-ink)]/85 hover:shadow-premium hover:-translate-y-0.5",
    secondary: "bg-[var(--color-surface)] text-[var(--color-ink)] shadow-sm hover:text-[var(--color-gold)] hover:shadow-premium border border-[var(--color-ink)]/10 hover:-translate-y-0.5",
    outline: "bg-transparent border border-[var(--color-ink)]/20 text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold-soft)]",
    "outline-light": "bg-white/10 border border-white/40 text-white backdrop-blur-sm hover:bg-white hover:text-[var(--color-ink)] hover:border-white shadow-glass hover:-translate-y-0.5",
    cta: "bg-[var(--color-accent)] text-white shadow-[0_0_20px_rgba(196,164,124,0.25)] hover:shadow-[0_0_30px_rgba(196,164,124,0.4)] hover:brightness-110 hover:-translate-y-0.5"
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-8 py-4 text-sm rounded-full",
    lg: "px-10 py-4 text-sm md:text-base rounded-full"
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Link to={to} className={combinedStyles}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href={href}
        target={target || "_blank"}
        rel={rel || "noopener noreferrer"}
        className={combinedStyles}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      className={combinedStyles}
    >
      {children}
    </motion.button>
  );
}
