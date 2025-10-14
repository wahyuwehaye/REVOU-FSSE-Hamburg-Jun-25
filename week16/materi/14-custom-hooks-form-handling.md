# Custom Hooks untuk Form Handling

## Masalah Umum Form
- Banyak field, validasi manual, state tersebar.
- Perlu reset, handling error, dan disabled state.

## Hook Sederhana
```ts
import { useCallback, useState } from "react";

type FormErrors<T> = Partial<Record<keyof T, string>>;

type UseFormOptions<T> = {
  initialValues: T;
  validate?: (values: T) => FormErrors<T>;
  onSubmit: (values: T) => Promise<void> | void;
};

export function useForm<T>({ initialValues, validate, onSubmit }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (validate) {
      const nextErrors = validate(values);
      setErrors(nextErrors);
      const hasError = Object.values(nextErrors).some(Boolean);
      if (hasError) return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => setValues(initialValues), [initialValues]);

  return { values, errors, submitting, handleChange, handleSubmit, reset };
}
```

## Pemakaian
```tsx
const form = useForm({
  initialValues: { email: "", password: "" },
  validate: (values) => ({
    email: values.email.includes("@") ? undefined : "Email tidak valid",
  }),
  onSubmit: async (values) => {
    await signIn("credentials", { ...values });
  },
});
```

## Tips
- Pisahkan hook validasi agar modular.
- Gunakan zod/yup untuk validasi kompleks.
- Hook dapat mengembalikan `register` mirip React Hook Form untuk ergonomi.

## Latihan
> Tambahkan fitur `dirty` (boolean) yang menandakan apakah ada perubahan dibanding initial values.

## Ringkas
Custom hook form merangkum pengelolaan state input, validasi, dan submit dalam satu tempat. Cocok untuk form sederhana sampai medium. EOF
