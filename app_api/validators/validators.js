// app_api/validators/validators.js
//
// Previously, input checking was scattered and inconsistent: auth.js did
// a manual null check on three fields, while trips.js did no checking at
// all and just let bad data hit Mongoose. This module centralizes
// validation rules using express-validator.

const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => e.msg)
    });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const tripRules = [
  body('code').trim().notEmpty().withMessage('Trip code is required'),
  body('name').trim().notEmpty().withMessage('Trip name is required'),
  body('length').trim().notEmpty().withMessage('Trip length is required'),
  body('start').isISO8601().withMessage('Start must be a valid date'),
  body('resort').trim().notEmpty().withMessage('Resort is required'),
  body('perPerson').isFloat({ min: 0 }).withMessage('Per-person price must be 0 or greater'),
  body('image').trim().notEmpty().withMessage('Image is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  validate
];

module.exports = { registerRules, loginRules, tripRules };