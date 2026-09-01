import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";
import { navItems, siteConfig, whatsappLink } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{siteConfig.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{siteConfig.location}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Follow</h3>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            {siteConfig.fullName}, {siteConfig.founded} to present. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
