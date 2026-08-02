import { useLocation } from "react-router-dom";
import LeadCaptureDock from "@/components/conversion/LeadCaptureDock.jsx";
import ExitDemoOffer from "@/components/conversion/ExitDemoOffer.jsx";

function isEligibleMarketingPath(pathname) {
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

export default function LeadCaptureTools() {
  const { pathname } = useLocation();
  if (!isEligibleMarketingPath(pathname)) return null;

  return (
    <>
      <LeadCaptureDock />
      <ExitDemoOffer pathname={pathname} />
    </>
  );
}
