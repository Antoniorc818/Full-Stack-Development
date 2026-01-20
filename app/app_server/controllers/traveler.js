// app_server/controllers/travlr.js
const home = (req, res) => {
  res.render('index', {       // Renders index.hbs
    title: 'Travlr Getaways', // Dynamic data
    subtitle: 'Book your perfect trip today!'
  });
};

module.exports = {
  home
};
