export function isEligibleMarketingPath(pathname) {
  return (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/services" ||
    pathname === "/pricing" ||
    pathname === "/projects" ||
    pathname.startsWith("/projects/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/")
  );
}
