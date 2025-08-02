export function authorizeRole(user, allowedRoles = []) {
  return user && allowedRoles.includes(user.role);
}
