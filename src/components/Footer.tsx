
import { Link } from 'react-router-dom'
import { useSiteContent } from '../hooks/useSiteContent'
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
} from 'lucide-react'

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/mediazz_hub/',
    icon: '◎',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1A3MJows48/',
    icon: 'f',
  },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  const content = useSiteContent('global', 'main', { footerDescription: 'An independent creative media production house creating powerful visual stories for ambitious brands.', footerTagline: '{content.footerTagline}', footerEmail: 'mediazzhub@gmail.com', footerPhone: 'WhatsApp · +91 8358063254', footerLocation: 'Indore, Madhya Pradesh, India', footerAvailability: '{content.footerAvailability}', footerClosing: '{content.footerClosing}' })
  return (
    <footer className="border-t border-white/10 bg-[#171512] text-white">

      <div className="mx-auto max-w-[1440px] px-6 pb-12 pt-16 lg:px-12 lg:pt-20">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center">
              <img
                src="/mediazz-logo.png"
                alt="Mediazz Hub"
                className="h-14 w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              {content.footerDescription}
            </p>

            <p className="mt-5 text-xs font-bold tracking-[0.2em] text-[#c5a46d] uppercase">
              {content.footerTagline}
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-7 text-[11px] font-bold tracking-[0.25em] text-[#c5a46d] uppercase">
              Explore
            </p>

            <div className="flex flex-col items-start gap-4 text-sm text-white/65">
              {[
                { label: content.navHome, href: '/' },
                { label: content.navAbout, href: '/about' },
                { label: content.navServices, href: '/services' },
                { label: content.navPortfolio, href: '/portfolio' },
                { label: content.navContact, href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="transition-all duration-300 hover:translate-x-1 hover:text-[#e0bd7e]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-7 text-[11px] font-bold tracking-[0.25em] text-[#c5a46d] uppercase">
              Get in touch
            </p>

            <div className="flex flex-col items-start gap-5 text-sm text-white/65">

              <a
                href={`mailto:${content.footerEmail}`}
                className="group flex items-center gap-3 transition-colors hover:text-[#e0bd7e]"
              >
                <Mail size={17} className="shrink-0 text-[#c5a46d]" />
                <span>{content.footerEmail}</span>
              </a>

              <a
                href="https://wa.me/918358063254"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 transition-colors hover:text-[#e0bd7e]"
              >
                <MessageCircle size={17} className="shrink-0 text-[#c5a46d]" />
                <span>{content.footerPhone}</span>
                <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>

              <div className="flex items-center gap-3">
                <MapPin size={17} className="shrink-0 text-[#c5a46d]" />
                <span>{content.footerLocation}</span>
              </div>

              <p className="pl-7 text-xs text-white/40">
                {content.footerAvailability}
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <p className="mb-7 text-[11px] font-bold tracking-[0.25em] text-[#c5a46d] uppercase">
              Follow our work
            </p>

            <div className="flex flex-col items-start gap-5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm text-white/65 transition-colors hover:text-[#e0bd7e]"
                >
                  <span className="flex size-8 items-center justify-center border border-white/15 text-base font-bold text-[#c5a46d] transition-all group-hover:border-[#c5a46d] group-hover:bg-[#c5a46d] group-hover:text-[#171512]">
                    {social.icon}
                  </span>
                  {social.label}
                  <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}

              <a
                href="https://wa.me/918358063254"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-sm text-white/65 transition-colors hover:text-[#e0bd7e]"
              >
                <span className="flex size-8 items-center justify-center border border-white/15 text-[#c5a46d] transition-all group-hover:border-[#c5a46d] group-hover:bg-[#c5a46d] group-hover:text-[#171512]">
                  <MessageCircle size={16} />
                </span>
                WhatsApp
                <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>

            <p className="mt-8 text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">
              Indore · India · Worldwide
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[11px] font-medium tracking-[0.15em] text-white/40 uppercase">
            © {currentYear} Mediazz Hub. All rights reserved.
          </p>

          <p className="font-serif text-sm italic text-[#c5a46d]">
            {content.footerClosing}
          </p>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-white/50 uppercase transition-colors hover:text-[#e0bd7e]"
          >
            Back to top
            <ArrowUpRight size={15} className="-rotate-45" />
          </Link>
        </div>

      </div>
    </footer>
  )
}
