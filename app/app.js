require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const { expressjwt: expressJwt } = require('express-jwt');

require('../app_api/models/db');
require('../app_api/models/trips');
require('../app_api/models/user');
require('../app_api/config/passport');

const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');
const tripIndex = require('../app_api/utils/tripIndex');

// Build the in-memory trie search index from whatever is already in the
// database once the connection is open, so search works immediately
// without waiting on the first write to each trip.
mongoose.connection.once('open', async () => {
  const trips = await Trip.find({});
  tripIndex.buildIndex(trips);
});

const jwtConfig = require('../app_api/config/auth');
const { errorHandler } = require('../app_api/middleware/errorHandler');

const indexRouter = require('../app_server/routes/index');
const travelRouter = require('../app_server/routes/travel');
const apiRouter = require('../app_api/routes/index');

const app = express();
const port = 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

/* Static Files */
app.use(express.static(path.join(__dirname, '../public')));

/* Public Routes */
app.use('/', indexRouter);
app.use('/travel', travelRouter);



/* API Routes */
app.use('/api', apiRouter);

/* 404 Handler */
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.status(404).render('error', { title: 'Page Not Found' });
});

/* Centralized Error Handler (must be last) */
app.use(errorHandler);

/* Server Start */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});