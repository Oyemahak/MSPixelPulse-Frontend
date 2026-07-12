# MSPixelPulse Launch Readiness Notes

## Research and Positioning

Commercial service keywords should map to real service pages and CTAs:

- web design Toronto
- small business website design
- website redesign services
- WordPress website design
- React website development
- e-commerce website development
- website maintenance services
- responsive website design
- SEO-friendly website design
- industry website examples for salons, dental clinics, education, real estate, wellness, home services, and healthcare

Informational topics belong in the blog:

- small business website cost in Canada
- WordPress vs React for business websites
- small business website features
- redesign checklist
- local-business trust and mobile-friendly design
- website maintenance basics

Do not promise rankings, guaranteed sales, fake results, fake awards, fake testimonials, or unsupported client counts.

## Domain Migration Checklist

- Choose one canonical domain format: `https://www.example.com` or `https://example.com`.
- Add the custom domain in Vercel and follow the DNS records Vercel provides.
- Confirm HTTPS is active before changing public links.
- Update `src/data/site.js` `site.url`.
- Update `public/sitemap.xml` and `public/robots.txt`.
- Verify canonical URLs, Open Graph URLs, and blog article structured data.
- Add the domain to Google Search Console and Bing Webmaster Tools.
- Submit the sitemap after DNS and HTTPS are stable.
- Configure email-domain DNS separately: SPF, DKIM, and DMARC.
- Plan redirects from the Vercel URL to the custom domain only after the custom domain is verified.

## Analytics Readiness

Do not hardcode tracking IDs. Use environment variables when IDs are available:

- `VITE_GA_MEASUREMENT_ID`
- `VITE_GSC_VERIFICATION`
- `VITE_BING_VERIFICATION`

Recommended events:

- Start Project click
- WhatsApp click
- phone click
- pricing package selection
- project live-site click
- project filter usage
- blog contact form completion

Keep event names practical and privacy-aware. Do not send private message text, email addresses, phone numbers, or client portal data to analytics.

## Marketing Launch Plan

- Publish the custom domain and verify all public routes.
- Create or update Google Business Profile with accurate service areas and contact details.
- Share the Projects page as a portfolio hub on LinkedIn and Instagram.
- Turn each demo website into one practical social post with the industry, problem, and website features.
- Use blog posts as educational outreach links for small business owners.
- Offer maintenance and redesign audits as follow-up conversations.
- Track which CTAs generate qualified inquiries before expanding paid campaigns.

## Legal and Trust Notes

Privacy Policy, Terms of Service, Cookie Policy, and Accessibility Statement should be drafted and reviewed before a full custom-domain marketing launch. Current contact forms collect inquiry details for follow-up; do not collect unnecessary private data.
