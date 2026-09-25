import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'button inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    variants: {
      variant: {
        default: 'button-primary bg-[#7c5cff] text-white hover:bg-[#947cff] shadow-md shadow-[#7c5cff3d]',
        primary: 'button-primary bg-[#7c5cff] text-white hover:bg-[#947cff] shadow-md shadow-[#7c5cff3d]',
        secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
        outline: 'button-outline bg-transparent border border-white/15 text-[#a1a1aa] hover:text-white hover:bg-white/5',
        destructive: 'bg-rose-600/90 hover:bg-rose-600 text-white',
        danger: 'bg-rose-600/90 hover:bg-rose-600 text-white',
        ghost: 'button-ghost bg-transparent text-[#a1a1aa] hover:text-white hover:bg-white/5',
        link: 'text-[#7c5cff] underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-[38px] px-4 py-2 text-xs',
        sm: 'min-h-[32px] px-3 py-1.5 text-xs gap-1.5',
        md: 'min-h-[38px] px-4 py-2 text-xs gap-2',
        lg: 'min-h-[44px] px-6 py-2.5 text-sm gap-2.5 font-semibold',
        icon: 'w-8 h-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-3.5 w-3.5 text-current mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
