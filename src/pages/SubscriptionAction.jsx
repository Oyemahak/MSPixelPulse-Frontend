import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LuArrowRight, LuCircleCheck, LuCircleX, LuLoaderCircle, LuMail } from "react-icons/lu";
import Meta from "@/components/Meta.jsx";
import Container from "@/components/layout/Container.jsx";
import { blogEngagement } from "@/lib/blogEngagement.js";
import { trackEvent } from "@/lib/analytics.js";

export default function SubscriptionAction({ action }) {
  const [params] = useSearchParams();
  const [state, setState] = useState({ status: "loading", message: "Checking your secure link…" });
  const confirmation = action === "confirm";
  const subscriptionToken = params.get("token") || "";

  useEffect(() => {
    let active = true;
    const request = confirmation
      ? blogEngagement.confirmSubscription(subscriptionToken)
      : blogEngagement.unsubscribe(subscriptionToken);
    request.then(() => {
      if (!active) return;
      setState({
        status: "success",
        message: confirmation
          ? "Your subscription is confirmed. Future insights will be sent to the address you approved."
          : "You have been unsubscribed and will not receive future blog emails.",
      });
      if (confirmation) trackEvent("blog_subscription_confirmed", { page_path: "/blog/subscription/confirm" });
    }).catch((error) => {
      if (active) setState({ status: "error", message: error.message || "This link could not be completed." });
    });
    return () => { active = false; };
  }, [confirmation, subscriptionToken]);

  const Icon = state.status === "loading" ? LuLoaderCircle : state.status === "success" ? LuCircleCheck : LuCircleX;

  return (
    <section className="section subscription-action-page">
      <Meta
        title={`${confirmation ? "Confirm subscription" : "Unsubscribe"} — MSPixelPulse`}
        description="Manage an MSPixelPulse blog email subscription."
        robots="noindex, nofollow"
      />
      <Container>
        <div className={`subscription-action-card is-${state.status}`}>
          <span><Icon className={state.status === "loading" ? "is-spinning" : ""} aria-hidden="true" /></span>
          <p className="blog-engagement-kicker"><LuMail aria-hidden="true" /> MSPixelPulse insights</p>
          <h1>{confirmation ? "Confirm your subscription" : "Email preferences"}</h1>
          <p role={state.status === "error" ? "alert" : "status"}>{state.message}</p>
          {state.status !== "loading" ? (
            <Link to="/blog" className="btn btn-primary">
              Browse practical guides <LuArrowRight aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
