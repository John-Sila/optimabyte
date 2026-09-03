// Central configuration for OptimaByte Softwares Inc.
// Update the values below and the change applies across the whole site.

export const siteConfig = {
  name: "OptimaByte",
  fullName: "OptimaByte Softwares Inc",
  tagline: "Software, mobile apps and websites built for how you work",
  description:
    "OptimaByte Softwares Inc designs and builds custom software, Android and iOS apps, and business websites, with ongoing database management and support after launch.",

  // Replace with the real business WhatsApp number, digits only, country code first.
  // Example for Kenya: 2547XXXXXXXX
  whatsappNumber: "254717405109",

  email: "optimabyte@gmail.com",
  phone: "+254 717 405 109",
  location: "Nairobi, Kenya",

  social: {
    facebook: "https://web.facebook.com/profile.php?id=61593890707647",
    instagram: "https://instagram.com/optimabyte",
  },

  founded: "2020",
};

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export type ServiceCategory = "software" | "design";

export interface ServiceDetail {
  id: string;
  category: ServiceCategory;
  title: string;
  summary: string;
  description: string;
  points: string[];
  icon: string; // lucide-react icon name, resolved in the component
}

export const services: ServiceDetail[] = [
  {
    id: "custom-software",
    category: "software",
    title: "Custom software",
    summary: "Business systems built around your actual workflow.",
    description:
      "We design and build internal systems for operations that off-the-shelf tools do not fit well: staff attendance, asset and inventory tracking, damage reporting, budgeting and approvals, and management reporting. Each system is scoped around the way your team already works, not the other way around.",
    points: [
      "Requirements mapped from your current process before any code is written",
      "Role-based access for staff, supervisors and admins",
      "Firebase or a self-hosted database, depending on your scale and budget",
      "Delivered with a short handover session for your team",
    ],
    icon: "Code2",
  },
  {
    id: "mobile-apps",
    category: "software",
    title: "Android and iOS apps",
    summary: "Native and cross-platform apps for staff or customers.",
    description:
      "We build mobile apps for internal use, such as field staff and warehouse teams, and for customer-facing products such as booking, ordering or loyalty apps. Apps are built in Flutter for a single codebase across Android and iOS, with native modules added where a feature needs it.",
    points: [
      "One codebase covering both Android and iOS",
      "Offline support where connectivity is not guaranteed",
      "Push notifications, QR or barcode scanning, and camera-based input",
      "Play Store and App Store submission handled on your behalf",
    ],
    icon: "Smartphone",
  },
  {
    id: "web-applications",
    category: "software",
    title: "Websites and web applications",
    summary: "Business sites, dashboards, booking and client portals.",
    description:
      "From a company website to a full client portal or internal dashboard, we build fast, responsive web applications using React and modern tooling. Every site ships with a working contact and booking path, not just static pages.",
    points: [
      "Responsive layout, tested across phone, tablet and desktop",
      "Light and dark mode support by default",
      "Forms connected to WhatsApp, email or a database as needed",
      "Built for fast load times, not heavy template bloat",
    ],
    icon: "Globe",
  },
  {
    id: "database-management",
    category: "software",
    title: "Database design and management",
    summary: "Schema design, administration, backups and migrations.",
    description:
      "Every application needs a database that is structured correctly from the start and looked after once it is live. We design schemas for new projects and take over administration of existing databases, including backups, indexing and performance tuning.",
    points: [
      "Schema design for relational or document databases",
      "Scheduled backups with a tested restore procedure",
      "Query and index optimisation as your data grows",
      "Data migration between platforms when you switch systems",
    ],
    icon: "Database",
  },
  {
    id: "maintenance-retainer",
    category: "software",
    title: "Maintenance and retainer support",
    summary: "Ongoing monitoring and support after your project launches.",
    description:
      "A launched system still needs monitoring, dependency updates, and a fast response when something breaks. Our monthly retainer covers this, so you are not paying per incident every time something needs attention.",
    points: [
      "Uptime and error monitoring",
      "Security and dependency updates",
      "Priority response window for urgent issues",
      "Monthly summary of what was done",
    ],
    icon: "ShieldCheck",
  },
  {
    id: "changes-modifications",
    category: "software",
    title: "Changes and modifications",
    summary: "New features or adjustments outside the original scope.",
    description:
      "Once a system is live, requirements change. Changes and modifications outside the agreed original scope are billed per request, on top of any active retainer, and are quoted before work starts so there are no surprises on the invoice.",
    points: [
      "Quoted before work begins, every time",
      "Turnaround depends on size, communicated up front",
      "Request changes directly over WhatsApp",
      "No change is made without your confirmation",
    ],
    icon: "Wrench",
  },
  {
    id: "graphic-design",
    category: "design",
    title: "Graphic design",
    summary: "Flyers, posters and promotional material.",
    description:
      "Design work for print and digital promotion, built to match your brand rather than a generic template.",
    points: [
      "Flyers, posters and social media graphics",
      "Source files handed over on completion",
      "Print-ready output at the correct resolution and bleed",
    ],
    icon: "Palette",
  },
  {
    id: "sticker-printing",
    category: "design",
    title: "Sticker printing",
    summary: "Custom stickers for branding and packaging.",
    description:
      "Custom sticker design and print sourcing for branding, packaging or promotional use, in the size and finish you need.",
    points: [
      "Die-cut or standard shapes",
      "Matte, gloss or waterproof finishes available",
      "Small and bulk print runs",
    ],
    icon: "Sticker",
  },
  {
    id: "publications",
    category: "design",
    title: "Publications and layout",
    summary: "Professional layout for reports, brochures and booklets.",
    description:
      "Layout and design for longer documents such as reports, brochures, catalogues and booklets, formatted for both print and digital distribution.",
    points: [
      "Consistent layout across long documents",
      "Print and digital (PDF) versions",
      "Editable source files provided",
    ],
    icon: "Newspaper",
  },
];

export interface PortfolioProject {
  id: string;
  title: string;
  category: "Software" | "Mobile" | "Web" | "Design";
  description: string;
  placeholder: boolean;
}

// Replace or extend this list with real projects and screenshots as they
// become available. Entries marked placeholder: true are shown as
// upcoming case studies rather than completed work.
export const portfolio: PortfolioProject[] = [
  {
    id: "fleet-operations-platform",
    title: "Fleet operations platform",
    category: "Mobile",
    description:
      "An internal Android application for an electric motorbike fleet operator, covering staff attendance, battery charging and swap tracking, damage reporting, store inventory and management reporting in one system.",
    placeholder: false,
  },
  {
    id: "case-study-two",
    title: "Case study coming soon",
    category: "Web",
    description: "Details and screenshots for this project will be added here.",
    placeholder: true,
  },
  {
    id: "case-study-three",
    title: "Case study coming soon",
    category: "Software",
    description: "Details and screenshots for this project will be added here.",
    placeholder: true,
  },
];

export interface PricingItem {
  title: string;
  cadence: string;
  price: string;
  description: string;
}

export const pricing: PricingItem[] = [
  {
    title: "Principal",
    cadence: "One-time, first month",
    price: "KES 25,000",
    description:
      "Covers the initial build of your software in the first month of development, from setup through to a working first version.",
  },
  {
    title: "Retainer and database management",
    cadence: "Every month, ongoing",
    price: "KES 5,500 / mo",
    description:
      "Ongoing maintenance, monitoring and database administration for the software once it is live.",
  },
  {
    title: "Changes and modifications",
    cadence: "Per request, on top of retainer",
    price: "KES 2,500",
    description:
      "Any change or addition outside the original software scope, billed per request in addition to the retainer.",
  },
];
