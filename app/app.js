// app/app.js
const express = require('express');
const path = require('path');

const indexRouter = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel'); // fixed path

const app = express();
const port = 3000;

// View engine
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/travel', travelRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { title: 'Page Not Found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
