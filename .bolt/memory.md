# Project memory

## Product intent & audience

- Mediazz Hub: creative media production company website.
- Audience: brands and companies seeking premium media production services.
- Scope: homepage only for now; additional pages deferred intentionally.

## Brand personality & voice

- Premium, cinematic, sophisticated, creative.
- Confident and professional tone; positions the studio as high-end.

## Visual design & UX direction

- Palette restricted to black, charcoal grey, and white.
- Dark cinematic theme throughout; no accent colors introduced.
- Hero: full-screen, slow-zooming light gradient, subtle grid texture, staggered fade-up animations, live "studio" badge, stats strip at bottom.
- Services: six cards with icons that invert to white on hover and a soft glow rising on hover.
- Portfolio preview: staggered four-tile grid with abstract monochrome artwork; play button fades in on hover.
- Process: four steps (Discover, Develop, Produce, Deliver) with oversized ghost numbers.
- Contact: form (name, email, service, project details) with confirmation screen.
- Navbar: frosted dark bar on scroll; mobile menu on small screens.
- Fully responsive from mobile to desktop.
- Crafted CSS gradient/grain artwork used in place of stock photos (Pexels API unavailable during build).

## Decisions, constraints & rationale

- Stack: Vite + React + TypeScript + Tailwind CSS.
- Homepage-only constraint honored; no routing or extra pages added.
- Contact form submissions stored in Supabase; visitors cannot read submissions.
- Real photos intentionally deferred; current monochrome gradients are placeholders that can be swapped later.
- Production build passes cleanly.

## Open questions & assumptions

- Whether real photography will replace CSS-generated artwork, and from which source once APIs are available.
- Whether additional pages (about, portfolio detail, individual service pages) will be needed next.
- Whether the color palette should stay strictly monochrome or introduce an accent color later.
- Contact form assumes Supabase persistence is sufficient; no email notification or CMS integration confirmed.