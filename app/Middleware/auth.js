const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  // Token should be in format: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return commonResponse(401, false, 'Access token is missing or invalid', null, null, res);
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach decoded token to request
    next();
  } catch (err) {
    return commonResponse(403, false, 'Invalid or expired token', null, null, res);
  }
};
