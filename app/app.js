// app/app.js
const express = require('express');
const path = require('path');

// Database connection
require('../app_api/models/db');  // connects to MongoDB
require('../app_api/models/trips');

// Server-rendered routes
const indexRouter = require('../app_server/routes/index');
const travelRouter = require('../app_server/routes/travel');

// API routes
const apiRouter = require('../app_api/routes/index');  // API endpoints

const app = express();
const port = 3000;

// View engine
app.set('views', path.join(__dirname, '../app_server/views'));
app.set('view engine', 'hbs');

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Server-side routes
app.use('/', indexRouter);
app.use('/travel', travelRouter);

// API route
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  // If API route, return JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      message: 'API endpoint not found'
    });
  }

  // Render website error page
  res.status(404).render('error', { title: 'Page Not Found' });
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
