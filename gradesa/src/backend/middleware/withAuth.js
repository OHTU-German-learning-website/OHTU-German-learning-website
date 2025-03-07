export function withAuth(callback) {
  const user = { id: 1, email: "test@gradesa.com" };
  return async (request, ...args) => {
    request.user = user;
    return await callback(request, ...args);
  };
}
