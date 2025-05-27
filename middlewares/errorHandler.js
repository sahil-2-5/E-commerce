// Custom error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack for developers

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
