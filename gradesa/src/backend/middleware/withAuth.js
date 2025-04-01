export function withAuth(callback, options = {}) {
  const { requireAuth = true, requireAdmin = false } = options;
  return async (request, ...args) => {
    const user = await checkSession();

    if (!user && requireAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (requireAdmin && !user.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    request.user = user;
    return await callback(request, ...args);
  };
}
