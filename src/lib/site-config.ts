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
  { label: "Help", href: "/help" },
];

export const legalLinks = [
  { label: "Help", href: "/help" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
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
    summary: "POS, ERP and business systems built around your actual workflow.",
    description:
      "We design and build point-of-sale systems, ERP for hospitals, schools and businesses, and internal tools for operations that off-the-shelf software does not fit well: staff attendance, asset and inventory tracking, fleet and rider reporting, budgeting and approvals, and management reporting. Each system is scoped around the way your team already works, not the other way around.",
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
      "Forms connected to a database, email or WhatsApp as needed",
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

export type ProjectCategory = "Software" | "Mobile" | "Web" | "Design";

export interface PortfolioProject {
  id: string;
  title: string;
  category: ProjectCategory;
  /** lucide icon name, used for the card visual when no screenshot is set. */
  icon: string;
  description: string;
  highlights: string[];
  stack: string[];
}

// Screenshots are not stored here. The admin pastes an image address on each
// card while signed in, and it is saved to Firebase for every visitor.
export const portfolio: PortfolioProject[] = [
  {
    id: "fleet-operations-platform",
    title: "Fleet operations platform",
    category: "Mobile",
    icon: "Smartphone",
    description:
      "An internal Android application for an electric motorbike fleet operator, covering staff attendance, battery charging and swap tracking, damage reporting, store inventory and management reporting in one system.",
    highlights: [
      "Attendance and shift records captured on the phone",
      "Battery swap and charging logs tied to each bike",
      "Damage reports with photos, routed to the right supervisor",
    ],
    stack: ["Flutter", "Firebase"],
  },
  {
    id: "rider-earnings-app",
    title: "Rider earnings and remittance app",
    category: "Mobile",
    icon: "Wallet",
    description:
      "An Android and iOS app for bike and delivery operators where riders report their daily earnings and expenses from their phones, and managers reconcile what was reported against what was remitted.",
    highlights: [
      "Riders submit earnings in seconds, even on a weak connection",
      "Managers see every rider, every day, with outstanding balances flagged",
      "Weekly and monthly summaries ready for payroll and owners",
    ],
    stack: ["Flutter", "Firebase", "M-Pesa"],
  },
  {
    id: "retail-pos",
    title: "Point of sale for shops and businesses",
    category: "Software",
    icon: "Receipt",
    description:
      "A fast point-of-sale system for shops, pharmacies and restaurants: quick checkout, stock that updates with every sale, receipts, and end-of-day reports an owner can read in a minute.",
    highlights: [
      "Sell, refund and print receipts from one screen",
      "Stock counts, low-stock alerts and supplier records",
      "Cash, M-Pesa and card payments recorded separately",
    ],
    stack: ["React", "Firebase", "M-Pesa"],
  },
  {
    id: "hospital-erp",
    title: "Hospital management system",
    category: "Software",
    icon: "Stethoscope",
    description:
      "An ERP for clinics and hospitals that joins registration, consultation notes, pharmacy, laboratory and billing, so a patient's visit is recorded once and every department sees the same information.",
    highlights: [
      "Patient registration and visit history",
      "Pharmacy stock linked to prescriptions",
      "Invoices, insurance claims and daily revenue reports",
    ],
    stack: ["React", "PostgreSQL", "Node.js"],
  },
  {
    id: "school-erp",
    title: "School management system",
    category: "Software",
    icon: "GraduationCap",
    description:
      "A school ERP covering admissions, student records, fee balances, exam results and report cards, with parents able to follow fees and progress from their phones.",
    highlights: [
      "Admissions and class lists in one place",
      "Fee statements, balances and payment history",
      "Exam entry and printable report cards",
    ],
    stack: ["React", "Firebase"],
  },
  {
    id: "business-websites",
    title: "Business websites with booking",
    category: "Web",
    icon: "Globe",
    description:
      "Fast, mobile-first websites for service businesses, with working contact and booking paths, light and dark themes, and an admin who can update what visitors see.",
    highlights: [
      "Loads quickly on mobile data",
      "Enquiries land in a dashboard, not a lost inbox",
      "Clear pricing and service pages that answer questions up front",
    ],
    stack: ["React", "Tailwind CSS", "Firebase"],
  },
  {
    id: "brand-and-print",
    title: "Brand and print kits",
    category: "Design",
    icon: "Palette",
    description:
      "Logos, flyers, posters, stickers and social media graphics designed as one consistent kit, delivered as print-ready files and editable sources.",
    highlights: [
      "Consistent colors, type and layout across every piece",
      "Print-ready output at the correct size and bleed",
      "Source files handed over on completion",
    ],
    stack: ["Figma"],
  },
];

export interface Industry {
  title: string;
  text: string;
  icon: string;
}

export const industries: Industry[] = [
  {
    title: "Fleets and logistics",
    text: "Rider earnings, bike and battery tracking, attendance and maintenance for boda, delivery and e-mobility operators.",
    icon: "Bike",
  },
  {
    title: "Retail and shops",
    text: "Point of sale, stock control and daily sales reports for shops, pharmacies, salons and eateries.",
    icon: "Store",
  },
  {
    title: "Hospitals and clinics",
    text: "Patient records, pharmacy, laboratory and billing joined into one hospital ERP.",
    icon: "Stethoscope",
  },
  {
    title: "Schools and colleges",
    text: "Admissions, fees, exams and report cards, with parents kept informed from their phones.",
    icon: "GraduationCap",
  },
  {
    title: "Growing businesses",
    text: "Accounts, inventory, payroll and approvals in an ERP that fits how your team already works.",
    icon: "Building2",
  },
];

export const techStack = [
  "Flutter",
  "React",
  "TypeScript",
  "Firebase",
  "PostgreSQL",
  "Node.js",
  "Android",
  "iOS",
  "M-Pesa payments",
  "Figma",
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "How do I start a project with you?",
    a: "Send a request from the Contact page or message us on WhatsApp. We reply by email with questions, then confirm the scope and price in writing before any work begins.",
  },
  {
    q: "How long will you take to reply?",
    a: "Requests sent before 6:00 pm Nairobi time get a reply later the same day, in the evening. Requests sent after 6:00 pm get a reply early the next morning.",
  },
  {
    q: "What does a project cost?",
    a: "Our standard structure is a one-time principal for the first month of development, a monthly retainer for maintenance and database management, and a per-request fee for changes. The exact figures are on the Pricing page. Larger builds are quoted individually after scoping.",
  },
  {
    q: "Do you build for both Android and iOS?",
    a: "Yes. We build in Flutter, so one codebase covers both platforms, and we handle Play Store and App Store submission for you.",
  },
  {
    q: "Can you build a POS or ERP for my hospital, school or business?",
    a: "Yes. We scope the system around your current process first, then build it in stages so your team can start using it early and give feedback as it grows.",
  },
  {
    q: "What happens after the software goes live?",
    a: "A monthly retainer covers monitoring, updates and database management. Changes outside the original scope are quoted per request, and nothing is changed without your confirmation.",
  },
  {
    q: "Who owns the software and the data?",
    a: "You own your business data. Ownership of the delivered software and source code is agreed in writing for each project before work starts, as set out in our Terms of Service.",
  },
  {
    q: "Why was my request form not sent?",
    a: "Check that your name, a valid email, a service and a few words of detail are filled in, and that I'm not a robot is ticked. To prevent spam each email and each device can send 3 requests per hour. If you are over the limit, wait a little or message us on WhatsApp.",
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
