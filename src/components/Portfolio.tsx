const projects = [
  {
    title: 'Neon District',
    category: 'Commercial',
    year: '2025',
    gradient: 'from-ink-600 via-ink-700 to-ink-900',
    initials: 'ND',
  },
  {
    title: 'Weightless',
    category: 'Brand Film',
    year: '2025',
    gradient: 'from-ink-500 via-ink-800 to-ink-950',
    initials: 'WL',
  },
  {
    title: 'Cold Open',
    category: 'Music Video',
    year: '2024',
    gradient: 'from-ink-700 via-ink-600 to-ink-900',
    initials: 'CO',
  },
  {
    title: 'Field Notes',
    category: 'Documentary',
    year: '2024',
    gradient: 'from-ink-800 via-ink-500 to-ink-900',
    initials: 'FN',
  },
]

export default function Portfolio() {
  return (
    <section id="work" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-ink-900/50" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-ink-300 uppercase">
              Selected Work
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Recent projects,
              <br />
              <span className="text-ink-400">built to be felt.</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-ink-300"
          >
            Request full portfolio
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 ${
                i % 2 === 1 ? 'sm:translate-y-8' : ''
              }`}
            >
              <div
                className={`relative flex h-64 items-center justify-center bg-gradient-to-br sm:h-80 ${project.gradient}`}
                aria-hidden="true"
              >
                <span className="font-display text-6xl font-extrabold tracking-tighter text-white/10 transition-all duration-700 group-hover:scale-110 group-hover:text-white/20">
                  {project.initials}
                </span>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%)]" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                {/* play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/30">
                  <div className="flex size-16 scale-75 items-center justify-center rounded-full border border-white/40 bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-white" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5-11-6.5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 bg-ink-800/80 px-6 py-5">
                <div>
                  <h3 className="font-display text-base font-bold text-white">{project.title}</h3>
                  <p className="mt-0.5 text-xs tracking-wide text-ink-300 uppercase">
                    {project.category}
                  </p>
                </div>
                <span className="text-sm text-ink-300">{project.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
