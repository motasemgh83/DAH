const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const { jwtSecret } = require('../config');
const { getPermissionsForRole } = require('../utils/permissions');
async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret, { expiresIn: '8h' });
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role, locale: user.locale, permissions: getPermissionsForRole(user.role) } };
}
module.exports = { login };
