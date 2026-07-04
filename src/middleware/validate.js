function getNested(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function validate(schema) {
  return (req, res, next) => {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = getNested(req.body, field) ?? getNested(req.params, field) ?? getNested(req.query, field);

      for (const rule of rules) {
        const error = rule.validator(value, field);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: '输入校验失败', errors });
    }

    return next();
  };
}

module.exports = validate;
