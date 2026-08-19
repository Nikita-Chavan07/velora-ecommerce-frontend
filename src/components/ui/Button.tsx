import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

  const variants = {
    primary: 'bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950',
    secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
    outline: 'border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white',
    ghost: 'text-stone-700 hover:bg-stone-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-sm px-7 py-3.5 tracking-wide',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
