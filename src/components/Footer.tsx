const socials = ['Instagram', 'Vimeo', 'YouTube', 'LinkedIn']

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 sm:flex-row lg:px-10">
        <p className="font-display text-lg font-extrabold tracking-tight text-white">
          MEDIAZZ<span className="text-ink-300"> HUB</span>
        </p>
        <div className="flex items-center gap-6">
          {socials.map((social) => (
            <a
              key={social}
              href="#top"
              className="text-xs font-medium tracking-wide text-ink-300 uppercase transition-colors hover:text-white"
            >
              {social}
            </a>
          ))}
        </div>
        <p className="text-xs text-ink-400">&copy; {new Date().getFullYear()} Mediazz Hub. All rights reserved.</p>
      </div>
    </footer>
  )
}
