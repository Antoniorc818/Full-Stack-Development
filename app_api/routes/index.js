// app_api/routes/index.js
const express = require('express');
const router = express.Router();

// Import the trips controller
const tripsController = require('../controllers/trips'); // path from routes to controllers

// API route to get all trips
router.get('/trips', tripsController.tripsList);

// Export the router
module.exports = router;
