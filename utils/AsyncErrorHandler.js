// In your error handler file (e.g., utils/asyncErrorHandler.js)

const asyncErrorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// **Crucial Step: Export the function**
module.exports = asyncErrorHandler;