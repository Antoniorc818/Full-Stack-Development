// app/app_server/routes/travel.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/travel'); // relative to routes folder

router.get('/', controller.travelList);  // must be a function

module.exports = router;
