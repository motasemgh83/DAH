const { permissionsByRole } = require('@daralhai/shared');
function getPermissionsForRole(role) { return permissionsByRole[role] || []; }
function hasPermission(user, permission) {
  if (!user) return false;
  const perms = getPermissionsForRole(user.role);
  return perms.includes('*') || perms.includes(permission);
}
module.exports = { getPermissionsForRole, hasPermission };
