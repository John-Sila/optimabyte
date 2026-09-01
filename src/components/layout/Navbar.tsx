import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { navItems, whatsappLink } from "@/lib/site-config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu on every route change.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <a
                href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
