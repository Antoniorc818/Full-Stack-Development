// app/app_server/controllers/travel.js
const path = require('path');
const trips = require(path.join(__dirname, '../../../data/trips.json')); // correct path to data

module.exports.travelList = (req, res) => {
  res.render('travel', {
    title: 'Travlr Getaways',
    trips
  });
};
