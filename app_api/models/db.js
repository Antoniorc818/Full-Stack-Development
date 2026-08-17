const mongoose = require('mongoose');

// Connection string is read from environment configuration rather than being
// hardcoded, so credentials/hosts differ safely between dev, test, and prod.
// A local default is kept only as a dev convenience fallback.
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/travlr';

if (!process.env.MONGODB_URI) {
  console.warn(
    'WARNING: MONGODB_URI is not set in the environment. ' +
    'Falling back to local default (mongodb://127.0.0.1/travlr). ' +
    'Set MONGODB_URI in your .env file before deploying.'
  );
}

// Connect to MongoDB (no options needed in Mongoose v7+)
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

require('./trips'); // load Trip model