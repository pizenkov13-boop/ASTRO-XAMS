/** Routes where the study timer auto-runs (quiz units + review queue). */
export function isStudyRoute(pathname: string): boolean {
  if (pathname === "/review") return true;
  return /^\/modules\/(grammar|vocabulary|sat|oge)\/[^/]+$/.test(pathname);
}
