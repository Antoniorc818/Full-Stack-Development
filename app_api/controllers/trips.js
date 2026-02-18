// app_api/controllers/trips.js
const mongoose = require('mongoose');

// Load the Trip model (already registered in db.js)
const Trip = mongoose.model('Trip');

// Controller function to get all trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}); // fetch all trips from MongoDB
    res.status(200).json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export the controller functions
module.exports = {
  tripsList
};
