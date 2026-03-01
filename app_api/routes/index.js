const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');

const authController = require('../controllers/auth');
const tripsController = require('../controllers/trips');

const auth = jwt({
  secret: process.env.JWT_SECRET || 'MY_SUPER_SECRET_KEY',
  algorithms: ['HS256'],
  userProperty: 'payload'
});

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Public GET
router.get('/trips', tripsController.tripsList);
router.get('/trips/:tripCode', tripsController.tripsReadOne);

// Protected routes
router.post('/trips', auth, tripsController.tripsAddTrip);
router.put('/trips/:tripCode', auth, tripsController.tripsUpdateTrip);
router.delete('/trips/:tripCode', auth, tripsController.tripsDeleteTrip);

module.exports = router;