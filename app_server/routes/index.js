// app_server/routes/index.js
const express = require('express');
const router = express.Router();

// Example travel packages data
const packages = [
  {
    id: 1,
    name: 'Beach Paradise',
    description: 'Relax on pristine beaches and soak up the sun.',
    price: 799,
    image: '/images/beach.jpg'
  },
  {
    id: 2,
    name: 'City Explorer',
    description: 'Discover historic landmarks and vibrant city life.',
    price: 599,
    image: '/images/city.jpg'
  },
  {
    id: 3,
    name: 'Mountain Adventure',
    description: 'Hike and explore breathtaking mountain trails.',
    price: 699,
    image: '/images/mountain.jpg'
  }
];

// Route to render the homepage
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Travlr Getaways',
    subtitle: 'Your next adventure awaits!',
    packages,
    year: new Date().getFullYear()
  });
});

// Export the router
module.exports = router;
