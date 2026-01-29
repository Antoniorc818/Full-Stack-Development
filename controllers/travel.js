const trips = require('../../data/trips.json'); 

module.exports.travelList = (req, res) => {
  res.render('travel', {
    title: 'Travlr Getaways',
    trips
  });
};
