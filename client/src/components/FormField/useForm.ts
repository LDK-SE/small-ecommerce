import { useRef, useState } from 'react';
import { FieldValue, ValidationRule, validateValue } from './validation';

export type FieldConfig = {
  rules?: ValidationRule[];
  required?: boolean;
};

export function useForm<T extends Record<string, FieldValue>>(initialValues: T, config: Record<keyof T, FieldConfig>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const setValue = (name: string, value: FieldValue) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const setError = (name: string, error: string) => {
    setErrors((current) => ({ ...current, [name]: error }));
  };

  const validate = async () => {
    const nextErrors: Record<string, string> = {};

    for (const [name, fieldConfig] of Object.entries(config)) {
      const rules = fieldConfig.required
        ? [{ type: 'required' as const }, ...(fieldConfig.rules || [])]
        : fieldConfig.rules || [];
      const error = await validateValue(values[name], rules);
      if (error) nextErrors[name] = error;
    }

    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      const node = document.querySelector(`[data-field-name="${firstError}"] input, [data-field-name="${firstError}"] textarea, [data-field-name="${firstError}"] select`) as HTMLElement | null;
      node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node?.focus();
      return false;
    }

    return true;
  };

  return {
    values,
    setValues,
    setValue,
    errors,
    setError,
    validate,
    fieldRefs
  };
}
