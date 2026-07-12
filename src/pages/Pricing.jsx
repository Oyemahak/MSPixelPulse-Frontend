// src/pages/Pricing.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Card, {
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { useTheme } from "@/lib/theme.js";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";

/* Icons */
import { LuRocket, LuMail } from "react-icons/lu";
import { SiReact, SiWordpress, SiWix } from "react-icons/si";

/* Format numbers as CAD */
const CAD = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }).format(n);

const plans = [
  {
    key: "react",
    stack: "MEAN/MERN Stack (Custom Coded)",
    price: 4000,
    description:
      "A fully custom-coded React website with fast performance and modern UX/UI.",
    icon: SiReact,
  },
  {
    key: "wordpress",
    stack: "WordPress",
    price: 2000,
    description:
      "A flexible WordPress site with themes, plugins, and CMS for easy content management.",
    icon: SiWordpress,
  },
  {
    key: "wix",
    stack: "Wix",
    price: 3000,
    description:
      "A beautifully designed Wix website with drag-and-drop editing and quick launch.",
    icon: SiWix,
  },
  {
    key: "email",
    stack: "Professional Email Setup",
    price: 400,
    description:
      "Business-grade email setup with your custom domain for a professional presence.",
    icon: LuMail,
  },
];

export default function Pricing() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const nav = useNavigate();
  const [selected, setSelected] = useState(plans[0].key);

  const active = useMemo(() => plans.find((p) => p.key === selected), [selected]);

  function goRegister() {
    const params = new URLSearchParams({
      plan: active.key,
      label: active.stack,
    }).toString();
    nav(`/contact?${params}`);
  }

  return (
    <section className="section">
      <Container>
        <Meta
          title="Website Pricing — MSPixelPulse"
          description="Review starting points for WordPress, React, Wix, professional email, and custom website projects with MSPixelPulse."
          canonical="/pricing"
        />
        <SectionTitle
          eyebrow="Our Packages"
          title={isDark ? "Starting points for website projects" : "Starting points for website projects"}
          align="center"
        />

        {/* Plan selector */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = selected === plan.key;
            return (
              <button
                key={plan.key}
                onClick={() => setSelected(plan.key)}
                className={
                  isDark
                    ? isActive
                      ? "btn btn-primary"
                      : "btn btn-outline"
                    : isActive
                    ? "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#2563ff] text-white font-semibold shadow"
                    : "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50"
                }
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                  {plan.stack}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected plan card */}
        <div className="max-w-xl mx-auto">
          {isDark ? (
            <Card className="card-surface text-center glass-hover">
              <CardHeader>
                <CardTitle className="inline-flex items-center justify-center gap-2">
                  {active.icon && <active.icon className="h-5 w-5" aria-hidden="true" />}
                  {active.stack}
                </CardTitle>
                <p className="text-textSub mt-2">{active.description}</p>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-semibold text-textSub">Starting from</span>
                  <span className="text-4xl font-bold text-primary">
                    {CAD(active.price)}
                  </span>
                  <span className="max-w-sm text-sm text-textSub">
                    Final pricing depends on scope, pages, content, integrations, and launch support.
                  </span>
                </div>

                <Button
                  className="btn-primary mt-6 inline-flex items-center gap-2"
                  onClick={goRegister}
                >
                  <LuRocket className="h-5 w-5" aria-hidden="true" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm text-center p-8">
              <div className="inline-flex items-center justify-center gap-2 text-slate-900 text-lg font-semibold">
                {active.icon && <active.icon className="h-5 w-5" aria-hidden="true" />}
                {active.stack}
              </div>
              <p className="text-slate-500 mt-2">{active.description}</p>

              <div className="flex flex-col items-center gap-2 mt-6">
                <span className="text-sm font-semibold text-slate-500">Starting from</span>
                <span className="text-4xl font-bold text-slate-900">
                  {CAD(active.price)}
                </span>
                <span className="max-w-sm text-sm text-slate-500">
                  Final pricing depends on scope, pages, content, integrations, and launch support.
                </span>
              </div>

              <button
                onClick={goRegister}
                className="mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-slate-900 text-white font-semibold shadow-sm"
              >
                <LuRocket className="h-5 w-5" aria-hidden="true" />
                Get Started
              </button>
            </div>
          )}
        </div>
        <div className={isDark ? "mx-auto mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-center" : "mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 bg-white/90 p-5 text-center shadow-sm"}>
          <p className={isDark ? "text-sm leading-6 text-textSub" : "text-sm leading-6 text-slate-600"}>
            Need help choosing? Send a quick note and we will recommend a practical starting point.
          </p>
          <ContactActions
            dark={isDark}
            className="mt-4 justify-center"
            whatsappLabel="Discuss pricing"
            message={`Hi MSPixelPulse, I would like to discuss pricing for ${active.stack}.`}
          />
        </div>
      </Container>
    </section>
  );
}
