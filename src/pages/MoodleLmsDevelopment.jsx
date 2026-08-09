import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import { seoPages } from "@/data/seoPages.js";
import { useTheme } from "@/lib/theme.js";
import {
  LuArrowRight,
  LuBookOpen,
  LuCheck,
  LuGraduationCap,
  LuLayoutDashboard,
  LuLifeBuoy,
  LuSettings,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";

const capabilities = [
  [LuGraduationCap, "Custom Moodle setup", "Plan and configure a Moodle learning environment around your school, training organization, or internal education workflow."],
  [LuLayoutDashboard, "Branded learner experience", "Improve navigation, dashboards, course discovery, mobile usability, and visual consistency for students and staff."],
  [LuUsers, "Roles and enrolment workflows", "Structure student, teacher, manager, and administrator access with practical enrolment and course-management flows."],
  [LuBookOpen, "Courses and learning activities", "Support course categories, assignments, quizzes, grading workflows, resources, and other Moodle learning activities."],
  [LuSettings, "Plugins and integrations", "Review plugins, email delivery, forms, external tools, APIs, authentication options, and operational integrations."],
  [LuShieldCheck, "Hosting, upgrades and reliability", "Plan backups, updates, staging, security basics, performance checks, version upgrades, and deployment readiness."],
  [LuLifeBuoy, "Ongoing Moodle support", "Help administrators maintain content, troubleshoot issues, improve usability, and keep the platform healthy after launch."],
];

const process = [
  "Review your current Moodle setup, users, courses, hosting, pain points, and goals.",
  "Define the smallest reliable improvement or implementation plan before adding complexity.",
  "Configure, customize, test, and document the learner and administrator journeys.",
  "Launch carefully with backups, role checks, course validation, mobile testing, and support planning.",
];

export default function MoodleLmsDevelopment() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="section overflow-x-hidden">
      <Meta {...seoPages.moodleLms} />
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <span className={isDark ? "badge mb-4" : "mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700"}>
            Moodle LMS Development & Support
          </span>
          <h1 className={isDark ? "text-4xl font-extrabold leading-tight text-white md:text-6xl" : "text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl"}>
            Custom Moodle LMS development for schools and training organizations
          </h1>
          <p className={isDark ? "mx-auto mt-5 max-w-3xl text-lg leading-8 text-textSub" : "mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600"}>
            MSPixelPulse supports Moodle learning environments with hands-on education technology experience across website operations, LMS administration, course structure, user workflows, responsive UI, upgrades, and ongoing technical support.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link className="btn btn-primary" to="/contact?service=moodle-lms-development">
              Discuss a Moodle project <LuArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link className="btn btn-glass" to="/blog/custom-moodle-lms-development-canada">
              Read the Moodle guide
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(([Icon, title, body]) => (
            <article key={title} className={isDark ? "card-surface rounded-2xl p-6" : "rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"}>
              <span className={isDark ? "grid h-11 w-11 place-items-center rounded-xl bg-primary/20 text-white" : "grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className={isDark ? "mt-4 text-xl font-black text-white" : "mt-4 text-xl font-black text-slate-950"}>{title}</h2>
              <p className={isDark ? "mt-3 text-sm leading-6 text-textSub" : "mt-3 text-sm leading-6 text-slate-600"}>{body}</p>
            </article>
          ))}
        </div>

        <div className={isDark ? "mt-14 card-surface rounded-2xl p-7 md:p-9" : "mt-14 rounded-2xl border border-blue-100 bg-white p-7 shadow-sm md:p-9"}>
          <h2 className={isDark ? "text-2xl font-black text-white md:text-3xl" : "text-2xl font-black text-slate-950 md:text-3xl"}>A practical Moodle implementation path</h2>
          <ol className={isDark ? "mt-6 space-y-4 text-textSub" : "mt-6 space-y-4 text-slate-600"}>
            {process.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-white">{index + 1}</span>
                <span className="pt-0.5 leading-6">{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <article className={isDark ? "card-surface rounded-2xl p-7" : "rounded-2xl border border-blue-100 bg-white p-7 shadow-sm"}>
            <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>Useful for</h2>
            <ul className={isDark ? "mt-5 space-y-3 text-textSub" : "mt-5 space-y-3 text-slate-600"}>
              {["Private schools and online schools", "Training providers and professional education teams", "Organizations replacing a difficult LMS workflow", "Teams that need Moodle administration or upgrade support", "Education projects that need a branded learner portal"].map((item) => (
                <li key={item} className="flex gap-2"><LuCheck className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
          </article>

          <article className={isDark ? "card-surface rounded-2xl p-7" : "rounded-2xl border border-blue-100 bg-white p-7 shadow-sm"}>
            <h2 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>Need help with an existing Moodle site?</h2>
            <p className={isDark ? "mt-4 leading-7 text-textSub" : "mt-4 leading-7 text-slate-600"}>
              You do not need to rebuild everything. We can review the current installation first and prioritize the highest-value fixes across usability, configuration, performance, course structure, administration, and deployment.
            </p>
            <div className="mt-6">
              <ContactActions dark={isDark} showPhone={false} whatsappLabel="Talk about Moodle" message="Hi MSPixelPulse, I would like to discuss Moodle LMS development or support." />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
