const mongoose = require('mongoose');
const User = mongoose.model('users');

/* Register User */
module.exports.register = async function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    await user.save();
    const token = user.generateJwt();
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
};

/* Login User */
module.exports.login = async function(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !user.validPassword(req.body.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = user.generateJwt();
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
};