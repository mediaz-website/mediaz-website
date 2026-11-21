# Mediazz Hub SEO + AEO automation

## Operating principle
Improve discoverability without publishing thin, repetitive, fabricated, or doorway content. Monitor continuously, propose improvements, and publish only validated changes.

## Phase 1 — Technical baseline
- Weekly GitHub Actions audit, plus manual workflow dispatch.
- Checks sitemap URLs for HTTP status, title, meta description, canonical URL, H1 count, noindex directives, and JSON-LD presence.
- Checks robots.txt and sitemap reference.
- Stores Markdown and JSON reports as workflow artifacts for 30 days.
- Does not change live content or claim keyword rankings.

## Phase 2 — Search data connection
Connect Google Search Console and GA4 using least-privilege credentials stored as GitHub/Supabase secrets. Pull query, page, country, device, clicks, impressions, CTR and average position data. Establish separate Indore and India reporting segments. Never store credentials in the repository.

## Phase 3 — Content intelligence
Use verified business facts from the CMS and Search Console opportunities to prepare service-page improvements, useful FAQs, approved case studies, articles, internal links and image alt text. Avoid mass-generated city pages, keyword stuffing, fabricated reviews, unsupported claims and duplicate articles.

## Phase 4 — Safe publishing
- AI drafts are stored as CMS drafts.
- Validate facts, uniqueness, page intent, links, schema and metadata.
- Auto-publish only low-risk deterministic fixes derived from approved CMS data.
- New articles, service/location pages, and claims about clients/results require owner approval.
- Keep revision history and rollback capability.

## AEO
Use accurate organization, local business, service, breadcrumb, article and FAQ structured data only where visible page content supports it. Clear, specific answers help answer engines understand the site; schema does not guarantee AI citations or rich results.

## Cadence
- Technical audit: weekly and on-demand.
- Search performance review: weekly after Search Console connection.
- Content planning: monthly based on actual queries and business priorities.
- Publish when there is a meaningful, quality-checked improvement, not on a timer.

## Required external setup
- Verify mediazhub.com in Google Search Console.
- Submit https://mediazhub.com/sitemap.xml.
- Connect Search Console data access.
- Provide Gemini API key through secure repository or Supabase secrets for AI drafting.
- Confirm CMS schema and publishing permissions before enabling automated publication.
