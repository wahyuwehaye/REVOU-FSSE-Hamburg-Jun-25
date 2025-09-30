import { forwardRef } from 'react';

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, ...props },
  ref
) {
  return (
    <label style={{ display: 'grid', gap: '0.35rem' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input
        ref={ref}
        {...props}
        style={{
          padding: '0.75rem',
          borderRadius: '0.75rem',
          border: `1px solid ${error ? '#f87171' : '#cbd5f5'}`,
        }}
      />
      {error ? <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</span> : null}
    </label>
  );
});
