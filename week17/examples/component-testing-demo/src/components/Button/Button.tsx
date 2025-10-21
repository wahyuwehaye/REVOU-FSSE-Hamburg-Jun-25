import { useState } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
  label: string;
  onClick?: () => Promise<void> | void;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export function Button({ label, onClick, disabled = false, variant = "primary" }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!onClick || disabled || loading) return;
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-live="polite"
      data-variant={variant}
    >
      {loading ? "Processing…" : label}
    </button>
  );
}
