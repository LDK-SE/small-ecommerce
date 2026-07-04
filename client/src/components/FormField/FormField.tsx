import React, { useId, useMemo, useState } from 'react';
import {
  FieldValue,
  ValidationRule,
  formatBankCard,
  formatDecimal,
  formatPhone,
  validateValue
} from './validation';

export type FieldType =
  | 'TextInput'
  | 'PhoneInput'
  | 'EmailInput'
  | 'NumberInput'
  | 'SelectInput'
  | 'DatePicker'
  | 'AddressCascader'
  | 'IdCardInput'
  | 'BankCardInput'
  | 'PasswordInput'
  | 'Textarea';

export interface FormFieldProps {
  name: string;
  label: string;
  type: FieldType;
  value: FieldValue;
  onChange: (name: string, value: string) => void;
  onError?: (name: string, error: string) => void;
  rules?: ValidationRule[];
  required?: boolean;
  placeholder?: string;
  validateTrigger?: 'onChange' | 'onBlur' | 'onSubmit';
  options?: Array<{ label: string; value: string }>;
  dependencies?: string[];
  deps?: Record<string, FieldValue>;
  validateOnDepsChange?: (value: FieldValue, deps: Record<string, FieldValue>) => true | string;
  rows?: number;
}

function normalizeByType(type: FieldType, value: string) {
  if (type === 'PhoneInput') return formatPhone(value);
  if (type === 'BankCardInput') return formatBankCard(value);
  if (type === 'NumberInput') return formatDecimal(value);
  return value;
}

export default function FormField({
  name,
  label,
  type,
  value,
  onChange,
  onError,
  rules = [],
  required,
  placeholder,
  validateTrigger = 'onBlur',
  options = [],
  deps = {},
  validateOnDepsChange,
  rows = 3
}: FormFieldProps) {
  const id = useId();
  const [error, setError] = useState('');
  const mergedRules = useMemo(
    () => (required ? [{ type: 'required' as const }, ...rules] : rules),
    [required, rules]
  );

  const runValidation = async (nextValue = value) => {
    let nextError = await validateValue(nextValue, mergedRules);
    if (!nextError && validateOnDepsChange) {
      const depResult = validateOnDepsChange(nextValue, deps);
      nextError = depResult === true ? '' : depResult;
    }
    setError(nextError);
    onError?.(name, nextError);
    return nextError;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const nextValue = normalizeByType(type, event.target.value);
    onChange(name, nextValue);
    if (validateTrigger === 'onChange') {
      runValidation(nextValue);
    } else if (error) {
      setError('');
      onError?.(name, '');
    }
  };

  const commonClass = `mt-1 w-full rounded-md border px-3 py-2 text-sm min-h-11 text-body ${
    error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-theme bg-surface-raised'
  }`;
  const errorId = `${id}-error`;

  return (
    <div data-field-name={name}>
      <label htmlFor={id} className="block text-sm font-medium text-body">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {type === 'SelectInput' ? (
        <select
          id={id}
          name={name}
          value={String(value || '')}
          onChange={handleChange}
          onBlur={() => validateTrigger === 'onBlur' && runValidation()}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={commonClass}
        >
          <option value="">{placeholder || '请选择'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'Textarea' || type === 'AddressCascader' ? (
        <textarea
          id={id}
          name={name}
          value={String(value || '')}
          onChange={handleChange}
          onBlur={() => validateTrigger === 'onBlur' && runValidation()}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={commonClass}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type === 'EmailInput' ? 'email' : type === 'DatePicker' ? 'date' : type === 'PasswordInput' ? 'password' : 'text'}
          inputMode={type === 'NumberInput' || type === 'PhoneInput' || type === 'BankCardInput' ? 'numeric' : undefined}
          autoComplete={
            type === 'EmailInput' ? 'email' : type === 'PhoneInput' ? 'tel' : name.toLowerCase().includes('address') ? 'street-address' : undefined
          }
          value={String(value || '')}
          onChange={handleChange}
          onBlur={() => validateTrigger === 'onBlur' && runValidation()}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={commonClass}
        />
      )}

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
