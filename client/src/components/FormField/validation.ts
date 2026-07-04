export type FieldValue = string | number | boolean | undefined | null;

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'phone'; message?: string }
  | { type: 'idCard'; message?: string }
  | { type: 'bankCard'; message?: string }
  | { type: 'decimal'; message?: string }
  | { type: 'integer'; message?: string }
  | { type: 'validator'; validator: (value: FieldValue) => true | string | Promise<true | string> };

export function normalizePhone(value: FieldValue) {
  return String(value || '').replace(/\D/g, '').slice(0, 11);
}

export function formatPhone(value: FieldValue) {
  const digits = normalizePhone(value);
  return digits.replace(/^(\d{3})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));
}

export function formatBankCard(value: FieldValue) {
  return String(value || '')
    .replace(/\D/g, '')
    .slice(0, 24)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatDecimal(value: FieldValue, max = 999999) {
  const cleaned = String(value || '')
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1');
  const number = Number(cleaned);
  if (!cleaned) return '';
  if (!Number.isFinite(number)) return '';
  return String(Math.min(number, max));
}

export async function validateValue(value: FieldValue, rules: ValidationRule[] = []) {
  const raw = value === undefined || value === null ? '' : String(value).trim();

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!raw) return rule.message || '此项为必填。';
        break;
      case 'minLength':
        if (raw.length < rule.value) return rule.message || `至少输入 ${rule.value} 个字符。`;
        break;
      case 'maxLength':
        if (raw.length > rule.value) return rule.message || `最多输入 ${rule.value} 个字符。`;
        break;
      case 'pattern':
        if (raw && !rule.value.test(raw)) return rule.message || '格式不正确。';
        break;
      case 'min':
        if (Number(raw) < rule.value) return rule.message || `数值不能小于 ${rule.value}。`;
        break;
      case 'max':
        if (Number(raw) > rule.value) return rule.message || `数值不能大于 ${rule.value}。`;
        break;
      case 'email':
        if (raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return rule.message || '请输入有效的邮箱地址。';
        break;
      case 'phone':
        if (raw && !/^1\d{10}$/.test(normalizePhone(raw))) return rule.message || '请输入有效的手机号码。';
        break;
      case 'idCard':
        if (raw && !/^\d{17}[\dXx]$/.test(raw)) return rule.message || '请输入有效的身份证号码。';
        break;
      case 'bankCard':
        if (raw && !/^\d{12,24}$/.test(raw.replace(/\s/g, ''))) return rule.message || '请输入有效的银行卡号。';
        break;
      case 'decimal':
        if (raw && !/^\d+(\.\d{1,2})?$/.test(raw)) return rule.message || '最多保留两位小数。';
        break;
      case 'integer':
        if (raw && !/^\d+$/.test(raw)) return rule.message || '请输入整数。';
        break;
      case 'validator': {
        const result = await rule.validator(value);
        if (result !== true) return result;
        break;
      }
      default:
        break;
    }
  }

  return '';
}
