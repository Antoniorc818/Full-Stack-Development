// app_api/models/trip.js
const mongoose = require('mongoose');

// Define the Trip schema
const tripSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  length: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  resort: {
    type: String,
    required: true
  },
  perPerson: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Register the Trip model with Mongoose
mongoose.model('Trip', tripSchema);
