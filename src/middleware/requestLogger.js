const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'production') {
      console.log(
        JSON.stringify({
          time: new Date().toISOString(),
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          durationMs: duration,
          requestId
        })
      );
    } else {
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
      );
    }
  });

  next();
};

module.exports = requestLogger;
