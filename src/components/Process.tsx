const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We dig into your brand, audience and goals. Every great piece of work starts with understanding the story worth telling.',
  },
  {
    number: '02',
    title: 'Develop',
    description:
      'Concepts, scripts, storyboards and mood films. We shape the creative direction with you before a single frame is shot.',
  },
  {
    number: '03',
    title: 'Produce',
    description:
      'Casting, locations, shoot days. A seasoned crew and precise production management bring the plan to life.',
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'Edit, grade, sound and finishing — mastered for every platform and delivered ready to publish.',
  },
]

export default function Process() {
  return (
    <section id="process" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-ink-300 uppercase">
            Our Process
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            From first call
            <br />
            <span className="text-ink-400">to final cut.</span>
          </h2>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.number}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60 p-8 transition-colors duration-500 hover:border-white/25"
            >
              <span
                className="pointer-events-none absolute -top-4 right-2 font-display text-7xl font-extrabold text-white/5 transition-colors duration-500 group-hover:text-white/10"
                aria-hidden="true"
              >
                {step.number}
              </span>
              <div className="relative">
                <div className="mb-8 flex items-center gap-3">
                  <span className="h-px w-8 bg-white/30" />
                  <span className="text-xs font-semibold tracking-widest text-ink-300">
                    {i === steps.length - 1 ? 'Final step' : `Step ${step.number}`}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-200">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
