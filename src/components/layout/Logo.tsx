import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site-config";

interface LogoProps {
  className?: string;
}

// Uses /public/logo.svg. Replace that file to change the logo everywhere.
export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label={`${siteConfig.name} home`}>
      <img
        src="/logo.svg"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-lg transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105"
      />
      <span className="text-lg font-bold tracking-tight text-foreground">{siteConfig.name}</span>
    </Link>
  );
}
