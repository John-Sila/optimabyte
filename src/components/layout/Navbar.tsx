import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ClipboardList, FileText, Menu, X, MessageCircle, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import AdminMenu from "@/components/admin/AdminMenu";
import { Button } from "@/components/ui/button";
import { navItems, whatsappLink } from "@/lib/site-config";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { admin } = useAuth();

  // Close the mobile menu on every route change.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = admin
    ? [...navItems, { label: "Reports", href: "/admin/reports" }, { label: "Invoices", href: "/admin/invoices" }]
    : navItems;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-border shadow-[0_8px_30px_-18px_hsl(var(--primary)/0.4)]" : "border-transparent"
      }`}
    >
      <div className="site-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {items.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gold-text transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Button asChild size="sm" variant="outline">
              <a
                href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </Button>
            <AdminMenu />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <AdminMenu compact />
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-border bg-background lg:hidden">
          <nav className="site-container flex flex-col gap-1 py-4" aria-label="Mobile">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {item.href === "/admin/reports" && <ClipboardList className="h-4 w-4" />}
                {item.href === "/admin/invoices" && <FileText className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
            {admin && (
              <Link
                to="/admin/logins"
                className={`flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  location.pathname === "/admin/logins"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Login activity
              </Link>
            )}
            <a
              href={whatsappLink("Hello OptimaByte, I would like to discuss a project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-3 text-sm font-medium text-primary-foreground"
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
