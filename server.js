const dotenv = require('dotenv');

dotenv.config();

const os = require('os');
const mongoose = require('mongoose');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const SHUTDOWN_TIMEOUT_MS = parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 30000;

const requiredEnv = ['JWT_SECRET', 'MONGO_URI'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const getLanUrls = (port) =>
  Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => `http://${item.address}:${port}`);

let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      getLanUrls(PORT).forEach((url) => console.log(`LAN API available at ${url}`));
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });

const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
