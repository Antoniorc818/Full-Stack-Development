const express = require('express');
const path = require('path');
const hbs = require('hbs');

const indexRouter = require('./app_server/routes/index');

const app = express();
const port = 3000;

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
