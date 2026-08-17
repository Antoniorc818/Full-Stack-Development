// app_api/models/trip.js
const mongoose = require('mongoose');

// Define the Trip schema
const tripSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [2, 'Trip code must be at least 2 characters'],
    maxlength: [20, 'Trip code cannot exceed 20 characters'],
    match: [/^[A-Za-z0-9_-]+$/, 'Trip code may only contain letters, numbers, hyphens, and underscores']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Trip name must be at least 3 characters'],
    maxlength: [100, 'Trip name cannot exceed 100 characters']
  },
  length: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d+\s+(day|days|night|nights)$/i, 'Length must look like "5 days" or "7 nights"']
  },
  start: {
    type: Date,
    required: true
  },
  resort: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Resort name must be at least 2 characters'],
    maxlength: [100, 'Resort name cannot exceed 100 characters']
  },
  perPerson: {
    type: Number,
    required: true,
    min: [0, 'Price per person cannot be negative'],
    max: [100000, 'Price per person exceeds the allowed maximum']
  },
  image: {
    type: String,
    required: true,
    trim: true,
    match: [/^(\/|https?:\/\/)\S+$/i, 'Image must be a relative path or a valid URL']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  }
});

// Compound index supporting the admin SPA's resort/date trip search and the
// resort reporting aggregation, in addition to the implicit unique index on code.
tripSchema.index({ resort: 1, start: 1 });

// Register the Trip model with Mongoose
mongoose.model('Trip', tripSchema);