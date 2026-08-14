import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        <span>{label}</span>

        <input
          className={`form-input ${error ? 'form-input--error' : ''}`}
          {...props}
        />

        {error && <small className="form-error">{error}</small>}
      </label>
    </div>
  );
}