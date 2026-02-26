import * as React from 'react';
import { cn } from '../lib/index';

type ButtonVariant = 'solid' | 'soft' | 'ghost' | 'outline';
type ButtonColor = 'primary' | 'secondary' | 'warning' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  children?: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-xs gap-1',
  sm: 'h-7 px-3 text-sm gap-1.5',
  md: 'h-8 px-3.5 text-sm gap-2',
  lg: 'h-10 px-4 text-base gap-2',
};

// Colors use MCP standard CSS variables (--color-*) provided by the host.
const variantColorClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary:
      'bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] hover:opacity-85 active:opacity-75',
    secondary:
      'bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] hover:opacity-80 active:opacity-70',
    warning: 'bg-[var(--color-text-warning)] text-white hover:opacity-85 active:opacity-75',
    danger: 'bg-[var(--color-text-danger)] text-white hover:opacity-85 active:opacity-75',
  },
  soft: {
    primary:
      'bg-[var(--color-background-info)] text-[var(--color-text-info)] hover:opacity-75 active:opacity-65',
    secondary:
      'bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:opacity-80 active:opacity-70',
    warning:
      'bg-[var(--color-background-warning)] text-[var(--color-text-warning)] hover:opacity-75 active:opacity-65',
    danger:
      'bg-[var(--color-background-danger)] text-[var(--color-text-danger)] hover:opacity-75 active:opacity-65',
  },
  ghost: {
    primary:
      'bg-transparent text-[var(--color-text-info)] hover:bg-[var(--color-background-secondary)] active:bg-[var(--color-background-tertiary)]',
    secondary:
      'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] active:bg-[var(--color-background-tertiary)]',
    warning:
      'bg-transparent text-[var(--color-text-warning)] hover:bg-[var(--color-background-warning)] active:bg-[var(--color-background-tertiary)]',
    danger:
      'bg-transparent text-[var(--color-text-danger)] hover:bg-[var(--color-background-danger)] active:bg-[var(--color-background-tertiary)]',
  },
  outline: {
    primary:
      'bg-transparent border border-[var(--color-border-primary)] text-[var(--color-text-info)] hover:bg-[var(--color-background-secondary)]',
    secondary:
      'bg-transparent border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]',
    warning:
      'bg-transparent border border-[var(--color-border-warning)] text-[var(--color-text-warning)] hover:bg-[var(--color-background-warning)]',
    danger:
      'bg-transparent border border-[var(--color-border-danger)] text-[var(--color-text-danger)] hover:bg-[var(--color-background-danger)]',
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', color = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-full cursor-pointer select-none flex-shrink-0 whitespace-nowrap',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          variantColorClasses[variant][color],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
