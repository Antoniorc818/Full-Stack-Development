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

/* JWT Protection for API Routes */
app.use('/api',
  expressJwt({
    secret: process.env.JWT_SECRET || "MY_SUPER_SECRET_KEY",
    algorithms: ['HS256']
  }).unless({
    path: [
      '/api/login',
      '/api/register'
    ]
  })
);

/* API Routes */
app.use('/api', apiRouter);

/* 404 Handler */
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.status(404).render('error', { title: 'Page Not Found' });
});

/* Server Start */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});