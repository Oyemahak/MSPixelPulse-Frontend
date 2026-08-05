import { useLocation } from "react-router-dom";
import LeadCaptureDock from "@/components/conversion/LeadCaptureDock.jsx";
import ExitDemoOffer from "@/components/conversion/ExitDemoOffer.jsx";
import { isEligibleMarketingPath } from "@/components/conversion/leadCapturePaths.js";

export default function LeadCaptureTools({ pathname: currentPathname }) {
  const location = useLocation();
  const pathname = currentPathname ?? location.pathname;
  if (!isEligibleMarketingPath(pathname)) return null;

  return (
    <>
      <LeadCaptureDock />
      <ExitDemoOffer pathname={pathname} />
    </>
  );
}
