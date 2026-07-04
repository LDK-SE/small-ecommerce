const required = (message) => ({
  validator: (value, field) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return message || `${field} 为必填项。`;
    }
    return null;
  }
});

const isEmail = (message) => ({
  validator: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message || '请输入有效的邮箱地址。';
    }
    return null;
  }
});

const minLength = (min, message) => ({
  validator: (value) => {
    if (value && String(value).trim().length < min) {
      return message || `至少需要 ${min} 个字符。`;
    }
    return null;
  }
});

const isInt = (min, message) => ({
  validator: (value) => {
    if (value !== undefined && value !== null && value !== '') {
      const n = Number(value);
      if (!Number.isInteger(n) || n < (min ?? 0)) {
        return message || `必须是大于等于 ${min ?? 0} 的整数。`;
      }
    }
    return null;
  }
});

const isDecimal = (min, message) => ({
  validator: (value) => {
    if (value !== undefined && value !== null && value !== '') {
      const n = Number(value);
      if (!Number.isFinite(n) || n < (min ?? 0)) {
        return message || `必须是大于等于 ${min ?? 0} 的数字。`;
      }
    }
    return null;
  }
});

const isArray = (message) => ({
  validator: (value) => {
    if (!Array.isArray(value) || value.length === 0) {
      return message || '必须是非空数组。';
    }
    return null;
  }
});

module.exports = { required, isEmail, minLength, isInt, isDecimal, isArray };
