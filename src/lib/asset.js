const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prefix a root-absolute public path with the deployment base path.
 * Lets the same build work at `/` (Vercel) and `/dhruv-birthday/` (GitHub Pages).
 */
export function asset(path) {
  return `${BASE}${path}`;
}
