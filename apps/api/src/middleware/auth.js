const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const prisma = require('../prisma');
const { hasPermission } = require('../utils/permissions');

async function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Invalid token user' });
    req.user = user;
    next();
  } catch (_e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) return res.status(403).json({ message: `Missing permission: ${permission}` });
    next();
  };
}
module.exports = { authRequired, requirePermission };
