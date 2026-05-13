export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
