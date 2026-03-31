const logger = require('../utils/logger');
module.exports = (err, req, res, _next) => {
  logger.error('Unhandled API error', { path: req.path, method: req.method, error: err.message });
  res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
};
