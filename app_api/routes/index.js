const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');

const authController = require('../controllers/auth');
const tripsController = require('../controllers/trips');
const jwtConfig = require('../config/auth');
const { registerRules, loginRules, tripRules } = require('../validators/validators');

const auth = jwt({
  secret: jwtConfig.secret,
  algorithms: jwtConfig.algorithms,
  userProperty: 'payload'
});

// Public routes
router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);

// Public GET
router.get('/trips', tripsController.tripsList);
router.get('/trips/reports/by-resort', tripsController.tripsReportByResort);
router.get('/trips/:tripCode', tripsController.tripsReadOne);

// Protected routes
router.post('/trips', auth, tripRules, tripsController.tripsAddTrip);
router.put('/trips/:tripCode', auth, tripRules, tripsController.tripsUpdateTrip);
router.delete('/trips/:tripCode', auth, tripsController.tripsDeleteTrip);

module.exports = router;