import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";
import { legalLinks, navItems, siteConfig, whatsappLink } from "@/lib/site-config";

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-gold-text hover:text-gold-text";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="site-container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto] lg:gap-14">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Navigate</h3>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-gold-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="break-all transition-colors hover:text-gold-text">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold-text"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{siteConfig.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Follow</h3>
            <div className="flex gap-3">
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialClass}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialClass}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={socialClass}>
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {siteConfig.founded} to present · {siteConfig.fullName} · v{siteConfig.version} · All rights reserved.
          </p>
          <p className="flex gap-4">
            {legalLinks.map((item) => (
              <Link key={item.href} to={item.href} className="transition-colors hover:text-gold-text">
                {item.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
