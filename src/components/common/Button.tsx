import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[36px]',
    md: 'px-4 py-2 text-base gap-2 min-h-[44px]',
    lg: 'px-6 py-3 text-lg font-semibold gap-2.5 min-h-[50px]',
    xl: 'px-8 py-4 text-xl font-bold gap-3 min-h-[60px]',
  };

  const variantStyles = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] focus-visible:ring-[#2563EB] shadow-sm',
    secondary: 'bg-[#0EA5A4] text-white hover:bg-[#0f766e] focus-visible:ring-[#0EA5A4] shadow-sm',
    outline: 'bg-white text-slate-800 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-400',
    danger: 'bg-[#DC2626] text-white hover:bg-[#b91c1c] focus-visible:ring-[#DC2626] shadow-sm',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
