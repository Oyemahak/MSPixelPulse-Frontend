// Release-curated project card summaries (15–25 words) keyed by canonical slug.
//
// The durable source of truth for a card summary is the project's
// `shortDescription` ("Short card description" in Admin → Projects). These
// curated values only fill in when that stored value is missing, too long for a
// card, or still exactly the pre-release text listed in
// `supersededShortDescriptions`. Any other value saved in Admin wins, so Admin
// edits keep working without a frontend release. Full descriptions are never
// changed here; they stay on the project records and detail pages.
export const projectCardSummaries = {
  "canstem-education":
    "A WordPress school website organizing programs, credit courses, admissions, and resources for students and families.",
  "aimze-salon":
    "A WordPress salon and spa website featuring service-led navigation, clear branding, and booking-focused contact paths.",
  "dazzling-smile-dental":
    "A calm Wix dental clinic website featuring a clear service overview, trust-first structure, and local search positioning.",
  "nexus-education-private-school":
    "A private school website featuring a large Ontario course catalogue, discovery tools, course outlines, and a course cart.",
  "unity-and-hope-home-care":
    "A mobile-friendly website for a non-medical home-care provider, built from supplied official brand and service materials.",
  "bloom-by-maryam-flower-boutique":
    "A polished flower boutique storefront featuring shop filters, product details, occasion pages, and an order inquiry flow.",
  "stephy-pet-grooming-studio":
    "A warm pet grooming website featuring services, packages, gallery-style sections, and clear booking calls to action.",
  "northstar-home-services":
    "A trust-first home services website featuring repair and maintenance services, credibility sections, and quote requests.",
  "ms-pixelpulse-realty-group":
    "A luxury real estate website featuring listing-style sections, a premium trust layout, and buyer and seller calls to action.",
  "ms-pixelpulse-wellness-studio":
    "An elegant wellness studio website featuring treatment discovery, immersive visuals, and an interactive booking experience.",
  "aurel-immigration-legal":
    "A premium Canadian immigration website featuring student resources, immigration pathways, smart search, and consultation experiences.",
  "brightpath-autism-child-development":
    "A source-backed website helping Ontario families navigate autism and child development resources with clear safety language.",
  "yemi-hair-affordables":
    "A hair catalogue featuring CAD and NGN pricing, saved carts and wishlists, editorial guidance, and inquiry-based ordering.",
  "nexus-education-private-school-lms":
    "A Moodle 4.5 LTS platform for a private school, with persistent services, backups, testing, and deployment guidance.",
  "serenity-home-care":
    "A calm, senior-friendly home-care website with accessible navigation, reusable service pages, and honest inquiry handling.",
  "savora-kitchen-table":
    "A restaurant platform featuring food ordering, demo checkout, live order tracking, and connected kitchen management.",
  "aurel-frame":
    "A cinematic photography studio website featuring editorial galleries, wedding and event services, and a demo inquiry flow.",
  "lumina-dental-studio":
    "An editorial dental studio website featuring 24 service and studio pages, calm patient guidance, and a demo appointment flow.",
  "wedding-and-events":
    "A cinematic wedding and event planning website featuring editorial portfolios, rich media, and a multi-step inquiry flow.",
  "aurelia-restaurant-bar":
    "A warm, editorial restaurant and bar website featuring menus, reservations, private events, catering, and venue discovery.",
};

// Snapshot of the stored `shortDescription` values (production API, 2026-10-25)
// that the curated summaries above replace. Once Admin saves any different
// card-sized value for a slug, that saved value is shown instead.
export const supersededShortDescriptions = {
  "canstem-education": "A public school website focused on programs, admissions, and parent trust.",
  "aimze-salon": "A beauty service website for salon discovery, services, and client booking intent.",
  "dazzling-smile-dental": "A calm dental clinic website presence for services, trust, and local discovery.",
  "nexus-education-private-school":
    "A responsive education website with 207 course and outline routes, discovery tools, and a course cart.",
  "unity-and-hope-home-care": "A responsive home-care website based on supplied official brand and service materials.",
  "bloom-by-maryam-flower-boutique": "A polished demo e-commerce experience for flowers, occasions, and event florals.",
  "stephy-pet-grooming-studio": "A warm grooming demo with services, packages, gallery-style sections, and booking CTAs.",
  "northstar-home-services": "A conversion-focused local service demo with trust sections and quote CTAs.",
  "ms-pixelpulse-realty-group": "A luxury real estate demo with listing-style sections and buyer/seller CTAs.",
  "aurel-immigration-legal":
    "An editorial immigration website concept featuring student resources, Canadian pathways, instant search and a consultation preview.",
  "brightpath-autism-child-development": "A source-backed resource concept for Ontario autism and child development navigation.",
  "yemi-hair-affordables": "A polished hair catalogue with CAD and NGN views, editorial guidance, and safe order handoff.",
  "nexus-education-private-school-lms": "A Moodle 4.5 LTS platform with persistent services, backups, testing, and deployment guidance.",
  "serenity-home-care": "A calm, accessible home-care demo with service detail pages and honest inquiry handling.",
};
