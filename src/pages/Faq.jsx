import { Link } from "react-router-dom";
import { LuArrowRight, LuChevronDown, LuCircleHelp } from "react-icons/lu";
import Container from "@/components/layout/Container.jsx";
import ContactActions from "@/components/ContactActions.jsx";
import Meta from "@/components/Meta.jsx";
import { PageHero } from "@/components/public/PublicPageHeader.jsx";
import { faqSeo } from "@/data/discoverabilitySeo.js";
import { faqGroups } from "@/data/faqs.js";
import { useTheme } from "@/lib/theme.js";

export default function Faq() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const surface = isDark
    ? "card-surface text-white"
    : "rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm";
  const muted = isDark ? "text-textSub" : "text-slate-600";

  return (
    <section className="section overflow-x-hidden">
      <Meta {...faqSeo} />
      <Container>
        <PageHero
          eyebrow="MSPixelPulse FAQ"
          eyebrowIcon={LuCircleHelp}
          title="Straight answers about websites, platforms, pricing, and support."
          description="Use these factual answers to understand what MSPixelPulse does, who the agency works with, and how a website or learning-platform project is scoped."
          actions={
            <>
              <Link className="btn btn-primary" to="/services">Explore services <LuArrowRight aria-hidden="true" /></Link>
              <Link className="btn btn-glass" to="/pricing">Review pricing</Link>
            </>
          }
        />

        <nav className={`${surface} mt-10 p-5`} aria-label="FAQ topics">
          <h2 className="text-lg font-black">Browse by topic</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {faqGroups.map((group) => (
              <a key={group.category} href={`#${sectionId(group.category)}`} className={isDark ? "badge" : "rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"}>
                {group.category}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {faqGroups.map((group) => (
            <section key={group.category} id={sectionId(group.category)} aria-labelledby={`${sectionId(group.category)}-title`} className="scroll-mt-28">
              <h2 id={`${sectionId(group.category)}-title`} className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-950"}>{group.category}</h2>
              <div className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <details key={item.question} className={`${surface} group p-5`}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                      {item.question}
                      <LuChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className={`mt-3 leading-7 ${muted}`}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className={`${surface} mt-14 grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8`}>
          <div>
            <h2 className="text-2xl font-black">Have a question about your specific website?</h2>
            <p className={`mt-2 max-w-2xl leading-7 ${muted}`}>Send the current URL when available, describe the main problem, and explain what customers or learners should be able to do.</p>
          </div>
          <ContactActions dark={isDark} showPhone={false} whatsappLabel="Ask MSPixelPulse" message="Hi MSPixelPulse, I have a question about a website project." />
        </section>
      </Container>
    </section>
  );
}

function sectionId(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
