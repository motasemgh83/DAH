const prisma = require('../prisma');
async function notifyRoles(roles, title, message, requestId = null) {
  const users = await prisma.user.findMany({ where: { role: { in: roles }, isActive: true } });
  if (!users.length) return [];
  return prisma.$transaction(users.map((user) => prisma.notification.create({ data: { userId: user.id, requestId, title, message } })));
}
async function notifyUser(userId, title, message, requestId = null) {
  return prisma.notification.create({ data: { userId, requestId, title, message } });
}
module.exports = { notifyRoles, notifyUser };
