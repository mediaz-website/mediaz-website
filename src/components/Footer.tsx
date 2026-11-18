const socials = ['Instagram', 'Vimeo', 'LinkedIn']
const currentYear = new Date().getFullYear()

export default function Footer() {
  return <footer className="border-t border-white/15 bg-ink-950 py-8"><div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-12"><p className="font-display text-lg font-bold tracking-[-0.06em] text-white">MEDIAZZ<span className="text-white/35">/HUB</span></p><div className="flex gap-6">{socials.map((social) => <a key={social} href="#top" className="text-[10px] font-medium tracking-[0.2em] text-white/45 uppercase transition-colors hover:text-white">{social}</a>)}</div><p className="font-mono text-[10px] tracking-wide text-white/30">© {currentYear} MEDIAZZ HUB</p></div></footer>
}
