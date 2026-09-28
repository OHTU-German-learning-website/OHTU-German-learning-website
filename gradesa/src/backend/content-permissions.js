export function canAccessAdminView(user, actAsValue) {
  if (!user?.id) {
    return false;
  }

  if (user.is_superadmin) {
    return true;
  }

  if (!user.is_admin) {
    return false;
  }

  return actAsValue === "admin" || actAsValue === "superadmin";
}

export function canDeleteOwnedContent(user, ownerId) {
  if (user?.is_superadmin) {
    return true;
  }

  if (!user?.is_admin) {
    return false;
  }

  if (ownerId == null) {
    return false;
  }

  return String(user.id) === String(ownerId);
}
