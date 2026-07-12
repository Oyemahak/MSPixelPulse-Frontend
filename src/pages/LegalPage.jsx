import { Link } from "react-router-dom";
import Container from "@/components/layout/Container.jsx";
import Meta from "@/components/Meta.jsx";
import { useTheme } from "@/lib/theme.js";
import { legalPages } from "@/data/legalPages.js";

export default function LegalPage({ page }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const content = legalPages[page] || legalPages.privacy;
  const muted = isDark ? "text-white/65" : "text-slate-600";
  const surface = isDark
    ? "border-white/10 bg-white/[0.045]"
    : "border-slate-200 bg-white shadow-sm";

  return (
    <main className="section">
      <Meta title={`${content.title} — MSPixelPulse`} description={content.description} canonical={`/${page}`} />
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-500">
            Draft for legal review
          </p>
          <h1 className={isDark ? "text-4xl font-black" : "text-4xl font-black text-slate-950"}>
            {content.title}
          </h1>
          <p className={`mt-3 leading-7 ${muted}`}>{content.description}</p>
          <p className={`mt-2 text-sm ${muted}`}>Last updated: {content.updated}</p>
        </div>

        <div className={`mt-8 max-w-4xl rounded-2xl border p-5 md:p-7 ${surface}`}>
          <div className="space-y-7">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className={isDark ? "text-xl font-black text-white" : "text-xl font-black text-slate-950"}>
                  {section.heading}
                </h2>
                <p className={`mt-2 leading-7 ${muted}`}>{section.body}</p>
              </section>
            ))}
          </div>
        </div>

        <div className={`mt-8 max-w-4xl rounded-2xl border p-5 ${surface}`}>
          <p className={`leading-7 ${muted}`}>
            These pages are operational drafts for MSPixelPulse and should be reviewed by a qualified legal professional before custom-domain launch or broader commercial use.
          </p>
          <Link className="mt-4 inline-flex font-bold text-blue-500 hover:underline" to="/contact">
            Contact MSPixelPulse
          </Link>
        </div>
      </Container>
    </main>
  );
}
