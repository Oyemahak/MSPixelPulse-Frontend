export const proofNotes = [
  { key: 'canstem-live-work', name: "Founder's in-house work", business: 'CanSTEM Education', message: "A public school website from MSPixelPulse founder Mahak Patel's in-house role at CanSTEM Education, with program-focused structure, admissions CTAs, and mobile-friendly content. Not an MSPixelPulse client engagement." },
  { key: 'aimze-live-work', name: 'Live website work', business: 'Aimze Studio Salon & Spa', message: 'A public salon website entry structured around services, appointment interest, and a clearer contact path.' },
  { key: 'home-services-concept', name: 'Website concept', business: 'Home Services', message: 'A demo-safe local service concept built around quote CTAs, trust sections, and responsive customer flow.' },
  { key: 'flower-boutique-concept', name: 'Website concept', business: 'Flower Boutique', message: 'A polished storefront concept with product discovery, occasion landing pages, and order inquiry paths.' },
  { key: 'real-estate-concept', name: 'Website concept', business: 'Real Estate', message: 'A premium real estate concept with buyer and seller CTAs, listing-style sections, and local trust signals.' },
  { key: 'client-workspace-proof', name: 'Portal workflow', business: 'Client workspace', message: 'Project rooms, files, approvals, messages, billing, and handoff notes can stay organized in one private workspace.' },
];

// Stored proof notes that still carry this superseded wording are corrected at
// render time. Any other value saved in Admin wins, so later edits keep working.
const supersededProofNoteNames = { 'canstem-live-work': 'Live website work' };

export function applyProofNoteCorrections(items = []) {
  return items.map((item) => {
    if (!item || item.name !== supersededProofNoteNames[item.key]) return item;
    const curated = proofNotes.find((note) => note.key === item.key);
    return curated ? { ...item, name: curated.name, message: curated.message } : item;
  });
}
