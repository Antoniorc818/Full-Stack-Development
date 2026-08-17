// app_server/routes/travel.js
const express = require('express');
const router = express.Router();

// Import the travel controller
const controller = require('../controllers/travel'); // path from routes to controllers

// Route to render the travel page
router.get('/', controller.travelList);  // controller function

// Export the router
module.exports = router;
