
import { Link } from 'react-router-dom'

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/mediazz_hub/' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/1A3MJows48/' },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[#f1f0ec] py-12 text-[#24231f]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src="/mediazz-logo.png"
              alt="Mediazz Hub"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#66655f]">
            Complete creative media production house. From concept to shoot.
          </p>
        </div>

        {/* Explore */}
        <div>
          <p className="mb-5 text-xs font-bold tracking-[0.18em] text-[#77766f] uppercase">
            Explore
          </p>

          <div className="flex flex-col items-start gap-3 text-sm text-[#55544e]">
            <Link to="/about" className="transition-colors hover:text-black">About</Link>
            <Link to="/services" className="transition-colors hover:text-black">Services</Link>
            <Link to="/portfolio" className="transition-colors hover:text-black">Portfolio</Link>
            <Link to="/contact" className="transition-colors hover:text-black">Contact</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-5 text-xs font-bold tracking-[0.18em] text-[#77766f] uppercase">
            Contact
          </p>

          <div className="flex flex-col items-start gap-3 text-sm text-[#55544e]">
            <a href="mailto:mediazhub@gmail.com" className="transition-colors hover:text-black">
              mediazhub@gmail.com
            </a>

            <a
              href="https://wa.me/918358063254"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-black"
            >
              +91 8358063254
            </a>

            <span>Indore, Madhya Pradesh · Pan India</span>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <p className="mb-5 text-xs font-bold tracking-[0.18em] text-[#77766f] uppercase">
            Follow
          </p>

          <div className="flex flex-col items-start gap-3 text-sm text-[#55544e]">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-black"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-3 border-t border-black/10 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <p className="text-xs tracking-wide text-[#77766f]">
          © {currentYear} MEDIAZZ HUB. All rights reserved.
        </p>

        <p className="text-xs font-medium tracking-[0.12em] text-[#77766f] uppercase">
          Made for brands with somewhere to go
        </p>
      </div>
    </footer>
  )
}
