import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site-config";

interface LogoProps {
  className?: string;
}

// Uses /public/logo.svg as a placeholder mark. Replace that file with the
// final logo asset and this component picks it up automatically.
export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img src="/logo.svg" alt={siteConfig.fullName} className="h-9 w-9 rounded-md" />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}
