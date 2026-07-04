const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_BASE_MS = 2000;

const connectDB = async (retryCount = 0) => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Mongoose will attempt to reconnect.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected.');
  });

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * Math.pow(2, retryCount);
      console.error(
        `MongoDB connection failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}). Retrying in ${delay / 1000}s...`
      );
      await new Promise((r) => setTimeout(r, delay));
      return connectDB(retryCount + 1);
    }
    throw err;
  }
};

module.exports = connectDB;
