// app_api/config/auth.js
//
// Single source of truth for JWT configuration. Previously the JWT secret
// was declared separately (and inconsistently) in app.js and in
// app_api/routes/index.js, each with its own hardcoded fallback string.
// Duplicating a secret across files is a design smell -- it's easy for
// the two copies to drift, and a hardcoded fallback means the app can
// silently run in an insecure state in production if the environment
// variable is ever missing. This module centralizes the value and fails
// fast instead.

if (!process.env.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is not set. Add it to your .env file before starting the server.'
  );
}

module.exports = {
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
};