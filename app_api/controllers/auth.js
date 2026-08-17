const mongoose = require('mongoose');
const User = mongoose.model('users');
const { asyncHandler } = require('../middleware/errorHandler');

/* Register User */
module.exports.register = asyncHandler(async (req, res) => {
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  await user.save();
  const token = user.generateJwt();
  res.status(201).json({ token });
});

/* Login User */
module.exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.validPassword(req.body.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = user.generateJwt();
  res.status(200).json({ token });
});