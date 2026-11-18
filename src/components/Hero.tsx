export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      {/* layered cinematic backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 animate-slow-zoom bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_100%,rgba(255,255,255,0.06),transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-36 lg:px-10">
        <div className="max-w-3xl">
          <p
            className="mb-6 inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-widest text-ink-200 uppercase"
            style={{ animationDelay: '80ms' }}
          >
            <span className="size-1.5 animate-pulse-dot rounded-full bg-white" />
            Creative Media Production Studio
          </p>

          <h1
            className="animate-fade-up font-display text-5xl leading-[1.05] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '180ms' }}
          >
            We craft stories
            <br />
            <span className="text-ink-400">that move people.</span>
          </h1>

          <p
            className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-ink-200 sm:text-lg"
            style={{ animationDelay: '300ms' }}
          >
            Mediazz Hub is a full-service production studio. From brand films and commercials to
            motion design and post-production — we turn bold ideas into cinematic work that
            demands attention.
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-col gap-4 sm:flex-row"
            style={{ animationDelay: '420ms' }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-ink-200"
            >
              Start a Project
              <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/5"
            >
              View Our Work
            </a>
          </div>

          <dl
            className="mt-16 grid max-w-lg animate-fade-up grid-cols-3 gap-8 border-t border-white/10 pt-8"
            style={{ animationDelay: '540ms' }}
          >
            {[
              ['120+', 'Projects delivered'],
              ['40+', 'Brands worldwide'],
              ['8', 'Industry awards'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-bold text-white sm:text-3xl">{value}</dd>
                <dd className="mt-1 text-xs tracking-wide text-ink-300 uppercase sm:text-sm">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 animate-fade-up sm:block"
        style={{ animationDelay: '700ms' }}
        aria-hidden="true"
      >
        <div className="h-14 w-px overflow-hidden bg-white/15">
          <div className="h-1/2 w-px animate-pulse-dot bg-white" />
        </div>
      </div>
    </section>
  )
}
