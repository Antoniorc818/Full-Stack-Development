// app_server/controllers/travel.js
const path = require('path');

// Load trips data from the project root data folder
const trips = require(path.join(__dirname, '../../data/trips.json')); 

// Controller function to render the travel page
module.exports.travelList = (req, res) => {
  res.render('travel', {
    title: 'Travlr Getaways',
    trips
  });
};
