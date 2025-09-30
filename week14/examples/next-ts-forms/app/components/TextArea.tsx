import { forwardRef } from 'react';

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, ...props },
  ref
) {
  return (
    <label style={{ display: 'grid', gap: '0.35rem' }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <textarea
        ref={ref}
        {...props}
        style={{
          padding: '0.75rem',
          minHeight: '140px',
          borderRadius: '0.75rem',
          border: `1px solid ${error ? '#f87171' : '#cbd5f5'}`,
        }}
      />
      {error ? <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</span> : null}
    </label>
  );
});
