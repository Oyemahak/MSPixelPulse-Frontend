import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "content");
const outputPath = path.join(outputDir, "blog-drafts.json");
const publishedCoverPath = path.join(rootDir, "src", "data", "blogCoverPhotos.js");

const pillars = [
  {
    category: "AI & Automation",
    topic: "Practical AI automation",
    benefit: "save time without weakening customer trust or privacy",
  },
  {
    category: "AI Search & SEO",
    topic: "AI search visibility",
    benefit: "make useful business information easier for search systems and people to understand",
  },
  {
    category: "Local SEO",
    topic: "Local search strategy",
    benefit: "connect nearby customers with accurate services, locations, and contact paths",
  },
  {
    category: "Web Design",
    topic: "High-trust website design",
    benefit: "create a clear first impression and guide visitors toward the right next step",
  },
  {
    category: "Web Development",
    topic: "Maintainable website development",
    benefit: "support reliable features, clean releases, and future improvements",
  },
  {
    category: "E-commerce",
    topic: "E-commerce experience planning",
    benefit: "help shoppers compare, trust, and buy with less friction",
  },
  {
    category: "Conversion",
    topic: "Conversion-focused website improvements",
    benefit: "turn more qualified visits into calls, bookings, quote requests, or purchases",
  },
  {
    category: "User Experience",
    topic: "Customer-centred user experience",
    benefit: "make important information and actions easier to find on every device",
  },
  {
    category: "Accessibility",
    topic: "Accessible website design",
    benefit: "remove avoidable barriers and create a more inclusive customer experience",
  },
  {
    category: "Performance",
    topic: "Website speed and Core Web Vitals",
    benefit: "improve loading, responsiveness, and visual stability",
  },
  {
    category: "Security & Privacy",
    topic: "Website security and privacy basics",
    benefit: "reduce preventable risk and handle customer information more carefully",
  },
  {
    category: "Content Strategy",
    topic: "Helpful website content strategy",
    benefit: "answer real customer questions with clear, original, useful information",
  },
  {
    category: "Social Media",
    topic: "Website and social media alignment",
    benefit: "turn short-lived social attention into owned customer journeys",
  },
  {
    category: "Email Marketing",
    topic: "Permission-based email growth",
    benefit: "build useful follow-up journeys without overwhelming subscribers",
  },
  {
    category: "Brand Strategy",
    topic: "Digital brand consistency",
    benefit: "make the business easier to recognize and trust across customer touchpoints",
  },
  {
    category: "Analytics",
    topic: "Privacy-aware website measurement",
    benefit: "measure meaningful outcomes instead of relying on vanity metrics",
  },
  {
    category: "WordPress",
    topic: "Sustainable WordPress planning",
    benefit: "balance editing flexibility, performance, security, and maintenance",
  },
  {
    category: "React & Modern Web",
    topic: "Modern React website planning",
    benefit: "support custom experiences without adding unnecessary complexity",
  },
  {
    category: "Website Care",
    topic: "Ongoing website care",
    benefit: "keep important pages, forms, links, and content dependable after launch",
  },
  {
    category: "Industry Websites",
    topic: "Industry-specific website strategy",
    benefit: "match content and actions to how customers actually choose this kind of business",
  },
];

const audiences = [
  {
    name: "restaurants and cafés",
    singular: "restaurant or café",
    action: "reserve, order, view a menu, or visit",
  },
  {
    name: "home-service businesses",
    singular: "home-service business",
    action: "request a quote, confirm a service area, or call",
  },
  {
    name: "real-estate professionals",
    singular: "real-estate professional",
    action: "explore services, view listings, or start a conversation",
  },
  {
    name: "wellness practices",
    singular: "wellness practice",
    action: "understand an offering, ask a question, or book",
  },
  {
    name: "clinics and dental practices",
    singular: "clinic or dental practice",
    action: "review services, prepare for a visit, or contact the office",
  },
  {
    name: "legal and immigration practices",
    singular: "legal or immigration practice",
    action: "understand scope, review next steps, or request a consultation",
  },
  {
    name: "schools and tutoring businesses",
    singular: "school or tutoring business",
    action: "compare programs, ask about fit, or register interest",
  },
  {
    name: "automotive and detailing businesses",
    singular: "automotive or detailing business",
    action: "compare packages, view work, or book a service",
  },
  {
    name: "event and wedding businesses",
    singular: "event or wedding business",
    action: "review a portfolio, understand packages, or inquire about a date",
  },
  {
    name: "retail and online stores",
    singular: "retail or online store",
    action: "discover, compare, and purchase the right product",
  },
];

const angles = [
  {
    label: "Practical guide",
    title: "A Practical Guide for 2026",
    intent: "informational",
    framing: "explain the fundamentals, decisions, and realistic first steps",
    excerptLead: "A practical guide",
    outlineLabel: "A practical starting framework",
  },
  {
    label: "Planning checklist",
    title: "A Planning Checklist",
    intent: "informational and commercial investigation",
    framing: "turn the topic into a clear review and implementation checklist",
    excerptLead: "A planning checklist",
    outlineLabel: "A practical planning checklist",
  },
  {
    label: "Common mistakes",
    title: "Common Mistakes and Better Alternatives",
    intent: "problem-aware",
    framing: "identify avoidable mistakes and show more useful alternatives",
    excerptLead: "A common-mistakes review",
    outlineLabel: "A practical mistake-and-alternative review",
  },
  {
    label: "90-day plan",
    title: "A Focused 90-Day Improvement Plan",
    intent: "action-oriented",
    framing: "sequence practical improvements across three realistic phases",
    excerptLead: "A focused 90-day plan",
    outlineLabel: "A practical 90-day sequence",
  },
  {
    label: "Measurement",
    title: "What to Measure and Improve",
    intent: "evaluation",
    framing: "connect the work to meaningful customer and business outcomes",
    excerptLead: "A measurement guide",
    outlineLabel: "A practical measurement framework",
  },
];

const markets = [
  "Canada",
  "Toronto",
  "Brampton",
  "Mississauga",
  "the Greater Toronto Area",
  "Ontario",
  "Vaughan",
  "Markham",
  "Oakville",
  "Hamilton",
];

const photoQueries = [
  "small business owner working",
  "entrepreneur portrait laptop",
  "creative team working together",
  "professional at work portrait",
  "business people meeting",
  "designer working laptop",
  "local shop owner portrait",
  "diverse team office",
];

const humanDescriptionPattern =
  /\b(person|people|woman|women|man|men|girl|boy|team|owner|entrepreneur|professional|worker|employee|colleague|designer|developer|artist|barber|stylist|florist|potter|carpenter|chef|mechanic|doctor|dentist|teacher|student|customer|cashier|adult|female|male)\b/i;

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function topicPhrase(value) {
  if (value.startsWith("AI ") || value.startsWith("React ")) return value;
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

async function fetchPhotoPage(query, page) {
  const url = new URL("https://unsplash.com/napi/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", "30");
  url.searchParams.set("content_filter", "high");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "MSPixelPulse editorial planning tool",
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash request failed (${response.status}) for ${query}, page ${page}`);
  }

  return response.json();
}

async function collectPhotos(targetCount) {
  const requests = [];
  for (const query of photoQueries) {
    for (let page = 1; page <= 12; page += 1) {
      requests.push({ query, page });
    }
  }

  const photos = new Map();
  for (let offset = 0; offset < requests.length && photos.size < targetCount; offset += 8) {
    const batch = requests.slice(offset, offset + 8);
    const results = await Promise.all(
      batch.map(({ query, page }) => fetchPhotoPage(query, page)),
    );

    for (const result of results) {
      for (const photo of result.results || []) {
        if (!photo.id || !photo.urls?.raw || !photo.user?.name) continue;
        const description = photo.alt_description || photo.description || "";
        if (!humanDescriptionPattern.test(description)) continue;
        photos.set(photo.id, {
          id: photo.id,
          description,
          url: `${photo.urls.raw}&auto=format&fit=crop&w=1200&h=675&q=82`,
          previewUrl: `${photo.urls.raw}&auto=format&fit=crop&w=640&h=360&q=76`,
          photographer: photo.user.name,
          photographerUrl: `${photo.user.links.html}?utm_source=mspixelpulse&utm_medium=referral`,
          sourceUrl: `${photo.links.html}?utm_source=mspixelpulse&utm_medium=referral`,
        });
      }
    }
  }

  if (photos.size < targetCount) {
    throw new Error(`Only found ${photos.size} unique cover photos; ${targetCount} are required.`);
  }

  return [...photos.values()].slice(0, targetCount);
}

function createDrafts(photos) {
  const drafts = [];
  let index = 0;

  for (const pillar of pillars) {
    for (const audience of audiences) {
      for (const angle of angles) {
        const market = markets[index % markets.length];
        const photo = photos[index];
        const title = `${pillar.topic} for ${audience.name}: ${angle.title}`;
        const slug = slugify(title);
        const localNote =
          pillar.category === "Local SEO"
            ? `The draft must use ${market} examples naturally and avoid creating near-duplicate city doorway pages.`
            : `Use Canadian context where it materially helps; do not force ${market} into unrelated sections.`;

        drafts.push({
          id: `draft-${String(index + 1).padStart(4, "0")}`,
          status: "draft",
          indexable: false,
          title,
          slug,
          category: pillar.category,
          audience: audience.name,
          market,
          angle: angle.label,
          searchIntent: angle.intent,
          primaryKeyword: `${slugify(pillar.topic).replaceAll("-", " ")} ${audience.name}`,
          excerpt: `${angle.excerptLead} to help a ${audience.singular} in ${market} use ${topicPhrase(pillar.topic)} to ${pillar.benefit}.`,
          brief: {
            purpose: `Help decision-makers understand how to ${angle.framing} for a ${audience.singular}.`,
            readerOutcome: `The reader should leave with a realistic next step that helps customers ${audience.action}.`,
            localGuidance: localNote,
            outline: [
              `What ${topicPhrase(pillar.topic)} means for a ${audience.singular}`,
              `The customer questions this work should answer`,
              `${angle.outlineLabel} for the website and team`,
              `What to measure without relying on vanity metrics`,
              `When to improve internally and when specialist support may help`,
            ],
            editorialRequirements: [
              "Add first-hand MSPixelPulse experience or a clearly labeled practical example.",
              "Verify time-sensitive facts against primary sources before publication.",
              "Use plain English, descriptive headings, and a truthful call to action.",
              "Avoid guaranteed outcomes, keyword stuffing, fake urgency, and unsupported statistics.",
              "Complete human editorial, accessibility, image, and SEO review before changing status.",
            ],
          },
          cover: {
            ...photo,
            alt: `A real professional working in a setting related to ${topicPhrase(pillar.topic)} for ${audience.name}`,
          },
        });

        index += 1;
      }
    }
  }

  return drafts;
}

const photos = await collectPhotos(1_000);
const drafts = createDrafts(photos);

await mkdir(outputDir, { recursive: true });
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      status: "editorial drafts only",
      indexable: false,
      editorialPolicy:
        "Every brief requires original expertise, current primary-source verification, and human review before publication.",
      count: drafts.length,
      drafts,
    },
    null,
    2,
  )}\n`,
);
await writeFile(
  publishedCoverPath,
  `// Generated by scripts/generate-blog-catalog.mjs from the reviewed Unsplash search snapshot.\n` +
    `// Keep photographer attribution attached wherever these images are displayed.\n` +
    `export const humanBlogCoverPhotos = ${JSON.stringify(photos.slice(0, 32), null, 2)};\n`,
);

console.log(`Generated ${drafts.length} draft briefs with ${photos.length} unique human-photo covers.`);
console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${publishedCoverPath}`);
