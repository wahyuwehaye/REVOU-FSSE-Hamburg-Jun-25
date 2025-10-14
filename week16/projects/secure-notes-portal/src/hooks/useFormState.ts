import { useCallback, useMemo, useState } from "react";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

type UseFormStateOptions<T> = {
  initialValues: T;
  validate?: (values: T) => FormErrors<T>;
  onSubmit: (values: T) => Promise<void> | void;
};

export function useFormState<T>({ initialValues, validate, onSubmit }: UseFormStateOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(initialValues), [values, initialValues]);

  const handleChange = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate?.(values) ?? {};
    setErrors(validationErrors);
    const hasError = Object.values(validationErrors).some(Boolean);
    if (hasError) return;

    try {
      setSubmitting(true);
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }, [validate, onSubmit, values]);

  const reset = useCallback(() => setValues(initialValues), [initialValues]);

  return { values, errors, submitting, isDirty, handleChange, handleSubmit, reset, setValues };
}
