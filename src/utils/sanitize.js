const sanitizeHtml = require('sanitize-html');

const stripHtml = (value) => {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
};

const sanitizeText = (value) => {
  if (typeof value !== 'string') return value;
  const stripped = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  return stripped.trim();
};

const sanitizeObject = (obj, fields) => {
  if (!obj || typeof obj !== 'object') return obj;
  const result = { ...obj };
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = sanitizeText(result[field]);
    }
  }
  return result;
};

module.exports = { stripHtml, sanitizeText, sanitizeObject };
