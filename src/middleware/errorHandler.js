const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
  }

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err.stack || err);

  const isOperational =
    statusCode === 400 ||
    statusCode === 401 ||
    statusCode === 403 ||
    statusCode === 404 ||
    statusCode === 409 ||
    statusCode === 429;

  // For Mongoose validation errors, expose field-level details
  const message = (() => {
    if (!isOperational && err.name !== 'ValidationError') {
      return '服务器内部错误，请稍后重试。';
    }
    if (err.name === 'ValidationError' && err.errors) {
      const fields = Object.values(err.errors).map((e) => e.message).join('；');
      return fields || err.message;
    }
    return err.message;
  })();

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
