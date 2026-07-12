import { LuArrowUpRight, LuCircleCheck, LuMessageSquare, LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router-dom";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import { useTheme } from "@/lib/theme.js";

const principles = [
  "Clear website structure before decoration",
  "Responsive layouts that work on real phones",
  "Flexible technology choices for the project need",
  "Accessible forms, navigation, contrast, and content",
  "Straightforward communication during launch and maintenance",
];

const helps = [
  "Small businesses planning a first professional website",
  "Owners who need a cleaner redesign or stronger mobile experience",
  "Service businesses that want portfolio, pricing, blog, and contact flows",
  "Clients who need a secure workspace for files, messages, and launch updates",
];

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const surface = isDark
    ? "border-white/10 bg-white/[0.045] text-white"
    : "border-slate-200 bg-white text-slate-950 shadow-sm";
  const muted = isDark ? "text-white/65" : "text-slate-600";

  return (
    <main className="section">
      <Meta
        title="About MSPixelPulse — Toronto Website Agency"
        description="Learn about MSPixelPulse, a Toronto website agency focused on clear, responsive, maintainable websites for small businesses."
        canonical="/about"
      />
      <Container>
        <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-500">
              About MSPixelPulse
            </p>
            <h1 className={isDark ? "text-4xl font-black leading-tight md:text-5xl" : "text-4xl font-black leading-tight text-slate-950 md:text-5xl"}>
              Practical website strategy, design, and delivery for local businesses.
            </h1>
            <p className={`mt-5 max-w-2xl text-lg leading-8 ${muted}`}>
              MSPixelPulse helps business owners turn scattered service details into a clear website experience: what you offer, why it matters, how to trust you, and how to contact you.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/contact">
                Start a project
              </Link>
              <a
                className={isDark ? "btn btn-outline" : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-bold text-slate-900 shadow-sm hover:bg-slate-50"}
                href="https://mahakpatel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Founder portfolio
                <LuArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 ${surface}`}>
            <div className="flex items-center gap-3">
              <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white">
                MP
              </span>
              <div>
                <h2 className="text-xl font-black">Mahak Patel</h2>
                <p className={`text-sm ${muted}`}>Founder, MSPixelPulse</p>
              </div>
            </div>
            <p className={`mt-5 leading-7 ${muted}`}>
              Mahak leads MSPixelPulse with a focus on honest project scoping, clean UX, accessible interfaces, and websites that owners can actually understand after launch.
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          <InfoCard
            dark={isDark}
            icon={<LuMessageSquare className="h-6 w-6 text-blue-500" aria-hidden="true" />}
            title="Who it helps"
            items={helps}
          />
          <InfoCard
            dark={isDark}
            icon={<LuCircleCheck className="h-6 w-6 text-blue-500" aria-hidden="true" />}
            title="How we work"
            items={principles}
          />
          <InfoCard
            dark={isDark}
            icon={<LuShieldCheck className="h-6 w-6 text-blue-500" aria-hidden="true" />}
            title="After launch"
            items={[
              "Maintenance and content updates when needed",
              "Portal-based project communication",
              "SEO-ready structure and practical page planning",
              "Ongoing improvements without inflated claims",
            ]}
          />
        </section>

        <section className={`mt-12 rounded-2xl border p-6 md:p-8 ${surface}`}>
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-black">Need a cleaner business website?</h2>
              <p className={`mt-2 max-w-2xl leading-7 ${muted}`}>
                Send a short note about your service, current website, and what needs to work better on mobile.
              </p>
            </div>
            <ContactActions
              dark={isDark}
              whatsappLabel="Chat on WhatsApp"
              message="Hi MSPixelPulse, I would like to discuss a website project."
            />
          </div>
        </section>
      </Container>
    </main>
  );
}

function InfoCard({ dark, icon, title, items }) {
  const cardClass = dark
    ? "border-white/10 bg-white/[0.045] text-white"
    : "border-slate-200 bg-white text-slate-950 shadow-sm";
  const muted = dark ? "text-white/65" : "text-slate-600";

  return (
    <article className={`rounded-2xl border p-5 ${cardClass}`}>
      {icon}
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <ul className={`mt-4 space-y-3 text-sm leading-6 ${muted}`}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
