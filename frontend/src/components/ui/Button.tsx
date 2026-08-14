import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className="button"
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Creating...' : children}
    </button>
  );
}