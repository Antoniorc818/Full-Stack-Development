// app_api/middleware/errorHandler.js
//
// Before this enhancement, every controller function wrapped its own body
// in a try/catch block and built its own response shape by hand. This
// duplicated the same boilerplate five separate times in trips.js alone,
// and the catch blocks didn't even agree with each other: one returned a
// clean custom message, the other dumped the raw Mongoose error object
// straight to the client. asyncHandler removes the repetition; the single
// errorHandler below is the only place that decides how errors become
// HTTP responses.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  // Mongoose validation errors -> 422 with field-level messages only
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(422).json({ message: 'Validation failed', errors });
  }

  // Duplicate key (e.g. trip code or email already exists) -> 409
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with that value already exists' });
  }

  // Anything we didn't explicitly recognize -> generic 500, no internals leaked
  console.error(err);
  return res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal Server Error'
  });
};

module.exports = { asyncHandler, errorHandler };