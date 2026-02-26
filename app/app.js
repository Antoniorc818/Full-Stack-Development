const express = require('express');
const path = require('path');
const cors = require('cors');

require('../app_api/models/db');
require('../app_api/models/trips');

const indexRouter = require('../app_server/routes/index');
const travelRouter = require('../app_server/routes/travel');
const apiRouter = require('../app_api/routes/index');

const app = express();
const port = 3000;

/* Middleware  */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static Files  */

app.use(express.static(path.join(__dirname, '../public')));

/* Routes  */

app.use('/', indexRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

/*  404 Handler */

app.use((req, res) => {

  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      message: 'API endpoint not found'
    });
  }

  res.status(404).render('error', {
    title: 'Page Not Found'
  });
});

/* Server Start */

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});