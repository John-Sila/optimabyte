// Price guide for every service, used by the Pricing page (one tab per service).
//
// All amounts are in Kenya shillings (KES), exclusive of VAT, and are GUIDE
// RANGES for the Nairobi market, not fixed quotes. A fixed quote is given after
// the scope is confirmed. Edit the numbers here and the page updates.
//
// The service ids match the ids in `services` (site-config.ts), which supplies
// each tab's title, icon and summary.

export interface Tier {
  name: string;
  /** Shown large, for example "KES 25,000 to 90,000". */
  price: string;
  /** Small text under the price, for example "one-time" or "per month". */
  unit: string;
  bestFor: string;
  includes: string[];
  /** Highlights the most common choice. */
  popular?: boolean;
}

export interface Factor {
  factor: string;
  /** What makes the price come in lower than the range. */
  lower: string;
  /** What pushes it higher than the range. */
  higher: string;
}

export interface ServicePricing {
  id: string;
  /** Starting price shown in the overview table. */
  from: string;
  intro: string;
  tiers: Tier[];
  factors: Factor[];
  notes: string[];
  quoteMessage: string;
}

export const pricingGuide: ServicePricing[] = [
  // ------------------------------------------------------------------ software
  {
    id: "custom-software",
    from: "KES 25,000",
    intro:
      "Custom systems are priced by how much they have to do, not by a flat rate. A small single-purpose tool and a hospital ERP are very different projects, so pick the size closest to yours, then read the factors below to see where in the range you are likely to land.",
    tiers: [
      {
        name: "Starter tool",
        price: "KES 25,000 to 90,000",
        unit: "one-time build",
        bestFor: "One job done well: staff attendance, a rider earnings log, a simple stock register.",
        includes: [
          "Up to about 5 screens and 2 user roles",
          "Cloud database with secure sign-in",
          "Basic reports and export to Excel",
          "Short handover session",
        ],
      },
      {
        name: "Shop or outlet POS",
        price: "KES 90,000 to 250,000",
        unit: "one-time build",
        bestFor: "A single shop, pharmacy, salon or eatery that needs sales, stock and daily reports.",
        includes: [
          "Sales, receipts, stock control and daily summaries",
          "Cashier, supervisor and admin roles",
          "Product and customer records",
          "Handover and staff walkthrough",
        ],
        popular: true,
      },
      {
        name: "Multi-branch business system",
        price: "KES 250,000 to 800,000",
        unit: "one-time build",
        bestFor: "Several branches, approvals, budgeting, asset tracking and management reporting.",
        includes: [
          "Branch-level and head-office views",
          "Approval workflows and audit trail",
          "Management dashboards and scheduled reports",
          "Staff training and handover",
        ],
      },
      {
        name: "ERP (hospital, school, large business)",
        price: "From KES 800,000",
        unit: "quoted after scoping, typically 800,000 to 3,000,000 or more",
        bestFor: "Full ERP with many modules, departments and a large number of users.",
        includes: [
          "Detailed requirements study before pricing",
          "Phased delivery, module by module",
          "Data migration from your current records",
          "Training for each department",
        ],
      },
    ],
    factors: [
      {
        factor: "Number of modules",
        lower: "One or two modules (for example sales and stock only) keeps you near the bottom of the range.",
        higher: "Each extra module, such as payroll, procurement or reporting, adds about KES 20,000 to 80,000.",
      },
      {
        factor: "User roles and permissions",
        lower: "Two simple roles (staff and admin) need no extra work.",
        higher: "Each additional role with its own permissions adds about KES 5,000 to 15,000.",
      },
      {
        factor: "Payments and tax integrations",
        lower: "No integrations: payments recorded manually inside the system.",
        higher: "M-Pesa payment integration adds about KES 15,000 to 50,000. KRA eTIMS invoicing can add KES 30,000 to 80,000.",
      },
      {
        factor: "Existing data",
        lower: "Starting fresh with no old records to bring in.",
        higher: "Importing from Excel or an old system adds about KES 10,000 to 50,000, more if the data is messy.",
      },
      {
        factor: "Offline use",
        lower: "Always online, which is fine for most shops and offices.",
        higher: "Working without internet and syncing later adds about KES 30,000 to 80,000.",
      },
      {
        factor: "How clear the requirements are",
        lower: "A written list of what you need can lower the quote by 10 to 20 percent, because less discovery time is needed.",
        higher: "Requirements that change during the build are handled as separate change requests.",
      },
    ],
    notes: [
      "The KES 25,000 principal on the overview tab is the entry rate for the smallest builds. Larger systems are priced from the ranges above.",
      "Hosting on Firebase is free at small scale. A self-hosted database has a monthly server cost that we quote up front.",
      "The monthly retainer starts from the second month after launch. See the Maintenance tab.",
    ],
    quoteMessage: "Hello OptimaByte, I would like a quote for custom software.",
  },

  {
    id: "mobile-apps",
    from: "KES 150,000",
    intro:
      "Apps are built in Flutter, so one build covers both Android and iOS. Cost rises with the number of screens, how much data sits behind them, and features such as maps, payments and offline use.",
    tiers: [
      {
        name: "Simple app",
        price: "KES 150,000 to 350,000",
        unit: "one-time build",
        bestFor: "A focused app with 3 to 6 screens, such as a booking form, a catalogue or a staff checklist.",
        includes: [
          "Android and iOS from one codebase",
          "Sign-in and cloud database",
          "Basic push notifications",
          "Store listing and submission",
        ],
      },
      {
        name: "Standard app",
        price: "KES 350,000 to 900,000",
        unit: "one-time build",
        bestFor: "Customer or staff apps with accounts, orders or bookings, and an admin to manage them.",
        includes: [
          "User accounts and roles",
          "Push notifications, QR or barcode scanning",
          "Admin panel to manage content and users",
          "Store submission on your behalf",
        ],
        popular: true,
      },
      {
        name: "Advanced app",
        price: "KES 900,000 to 2,500,000",
        unit: "one-time build",
        bestFor: "Field and logistics apps with offline use, live tracking, payments and many user types.",
        includes: [
          "Offline mode with sync",
          "Maps and live location",
          "Payments and multi-role access",
          "Staged rollout and training",
        ],
      },
    ],
    factors: [
      {
        factor: "Platforms",
        lower: "Android only can come in about 15 to 25 percent lower than the range.",
        higher: "Both Android and iOS is the standard in the ranges above. Heavy native features add cost.",
      },
      {
        factor: "Offline support",
        lower: "App needs internet to work, which suits most customer apps.",
        higher: "Offline work with sync adds about KES 60,000 to 150,000.",
      },
      {
        factor: "Payments",
        lower: "No in-app payments.",
        higher: "M-Pesa or card payments add about KES 20,000 to 50,000.",
      },
      {
        factor: "Maps and live tracking",
        lower: "A simple static address or location pin.",
        higher: "Live rider or vehicle tracking adds about KES 50,000 to 150,000.",
      },
      {
        factor: "Admin web panel",
        lower: "Content managed directly in the database by us.",
        higher: "A full admin website for your team adds about KES 80,000 to 250,000.",
      },
      {
        factor: "Design",
        lower: "Clean standard layout using proven patterns.",
        higher: "Custom animation and a fully bespoke design add 10 to 25 percent.",
      },
    ],
    notes: [
      "Store account fees are paid by you directly: roughly USD 25 once for Google Play and USD 99 a year for the Apple Developer Program.",
      "After launch, updates and monitoring are covered by the monthly retainer. New features are billed as changes.",
    ],
    quoteMessage: "Hello OptimaByte, I would like a quote for a mobile app.",
  },

  {
    id: "web-applications",
    from: "KES 30,000",
    intro:
      "A company website, an online booking system and a full client portal are three different levels of work. The biggest price differences come from whether you need to manage content yourself and whether users sign in.",
    tiers: [
      {
        name: "Business website",
        price: "KES 30,000 to 90,000",
        unit: "one-time build",
        bestFor: "A professional presence: services, about, portfolio and a working contact path.",
        includes: [
          "5 to 8 responsive pages, light and dark mode",
          "Contact form connected to email or WhatsApp",
          "Fast load times, tested on phone, tablet and desktop",
          "Basic search engine setup",
        ],
      },
      {
        name: "Managed site or booking site",
        price: "KES 90,000 to 250,000",
        unit: "one-time build",
        bestFor: "Sites where you change content yourself: catalogues, bookings, requests, an admin dashboard.",
        includes: [
          "Admin sign-in to edit content and see enquiries",
          "Forms saved to a database",
          "Booking or request workflow",
          "Handover session",
        ],
        popular: true,
      },
      {
        name: "Web application or client portal",
        price: "KES 250,000 to 900,000",
        unit: "one-time build",
        bestFor: "Dashboards, client portals and internal tools with sign-in, roles and reports.",
        includes: [
          "User accounts and role-based access",
          "Dashboards and exportable reports",
          "Integrations as required",
          "Training and handover",
        ],
      },
    ],
    factors: [
      {
        factor: "Number of pages",
        lower: "Staying within about 5 pages keeps you at the bottom of the range.",
        higher: "Each extra page adds about KES 3,000 to 8,000.",
      },
      {
        factor: "Content and images",
        lower: "You supply text and photos: saves about KES 5,000 to 15,000.",
        higher: "We write the copy or source images: adds about KES 5,000 to 20,000.",
      },
      {
        factor: "Online payments",
        lower: "Customers pay by WhatsApp, phone or on delivery.",
        higher: "An online shop with M-Pesa checkout adds about KES 60,000 to 150,000.",
      },
      {
        factor: "Languages",
        lower: "One language, usually English.",
        higher: "A second language such as Kiswahili adds about KES 15,000 to 40,000.",
      },
      {
        factor: "User accounts",
        lower: "A public site with no sign-in.",
        higher: "Customer accounts and roles move the project into the portal tier.",
      },
    ],
    notes: [
      "Domain and hosting are paid separately. A .co.ke domain typically costs about KES 1,000 to 1,500 a year. Small sites often run on free hosting tiers.",
      "A website still needs care after launch. The monthly retainer covers updates and monitoring.",
    ],
    quoteMessage: "Hello OptimaByte, I would like a quote for a website or web application.",
  },

  {
    id: "database-management",
    from: "KES 25,000",
    intro:
      "Database work comes in two kinds: one-off jobs such as design and migration, and ongoing administration. For software we build, administration is already included in the monthly retainer. The separate rates below apply to databases we take over.",
    tiers: [
      {
        name: "Schema design",
        price: "KES 25,000 to 120,000",
        unit: "one-time",
        bestFor: "Planning the structure of a new system before it is built.",
        includes: [
          "Tables or collections, relationships and rules",
          "Indexing plan for speed",
          "Written documentation of the design",
        ],
      },
      {
        name: "Migration",
        price: "KES 30,000 to 200,000",
        unit: "one-time",
        bestFor: "Moving data from Excel or an old system into a new platform.",
        includes: [
          "Cleaning and mapping of existing data",
          "Test migration and checks before go-live",
          "Final migration with a verified record count",
        ],
      },
      {
        name: "Performance review",
        price: "KES 15,000 to 60,000",
        unit: "one-time",
        bestFor: "A system that has become slow as data has grown.",
        includes: [
          "Query and index analysis",
          "Fixes applied and measured",
          "Report of what was changed",
        ],
      },
      {
        name: "Ongoing administration",
        price: "KES 8,000 to 25,000",
        unit: "per month, for databases we take over",
        bestFor: "Looking after a live database that was not built by us.",
        includes: [
          "Scheduled backups with a tested restore",
          "Monitoring and performance tuning",
          "Monthly summary of what was done",
        ],
        popular: true,
      },
    ],
    factors: [
      {
        factor: "Data volume",
        lower: "A few thousand records and a handful of tables.",
        higher: "Millions of records or many linked tables raise design, migration and tuning time.",
      },
      {
        factor: "Quality of existing data",
        lower: "Clean, consistent records move quickly.",
        higher: "Duplicates, missing fields and mixed formats can add 30 to 60 percent to migration.",
      },
      {
        factor: "Backup needs",
        lower: "Daily backups are standard.",
        higher: "More frequent backups, long retention or off-site copies add about KES 2,000 to 8,000 a month.",
      },
      {
        factor: "Platform",
        lower: "Firebase or a common managed database.",
        higher: "Older or unusual systems need extra time to learn and migrate safely.",
      },
    ],
    notes: [
      "Software built by OptimaByte includes database management in the standard KES 5,500 monthly retainer, from the second month.",
    ],
    quoteMessage: "Hello OptimaByte, I would like a quote for database design or management.",
  },

  {
    id: "maintenance-retainer",
    from: "KES 5,500 / mo",
    intro:
      "The retainer keeps a live system healthy so you are not paying per incident. The standard rate covers one application and its database. Busier systems, with more branches or users, get a higher tier with a faster response window.",
    tiers: [
      {
        name: "Standard retainer",
        price: "KES 5,500",
        unit: "per month, from the second month",
        bestFor: "One application with its database and a normal working-hours response.",
        includes: [
          "Uptime and error monitoring",
          "Security and dependency updates",
          "Database management and backups",
          "Monthly summary of work done",
        ],
        popular: true,
      },
      {
        name: "Business retainer",
        price: "KES 8,000 to 15,000",
        unit: "per month",
        bestFor: "Several apps or branches, or a team that relies on the system every day.",
        includes: [
          "Everything in Standard",
          "Priority response window for urgent issues",
          "Quarterly performance and security check",
        ],
      },
      {
        name: "Critical systems",
        price: "KES 15,000 to 40,000",
        unit: "per month",
        bestFor: "Hospital, school and multi-outlet POS systems where downtime is costly.",
        includes: [
          "Everything in Business",
          "Fastest response window, agreed in writing",
          "Monthly review call and improvement plan",
        ],
      },
    ],
    factors: [
      {
        factor: "Size of the system",
        lower: "One app with a few users stays on the standard rate.",
        higher: "More branches, modules and daily users move you to the next tier.",
      },
      {
        factor: "Response window",
        lower: "Working-hours response is included in the standard rate.",
        higher: "Faster and out-of-hours response is priced into the Business and Critical tiers.",
      },
      {
        factor: "Hosting",
        lower: "Free-tier or low-cost managed hosting.",
        higher: "Larger hosting or a dedicated server adds its own monthly cost, quoted up front.",
      },
    ],
    notes: [
      "The retainer does not include new features. Those are billed as changes, per request.",
      "The first month is covered by the principal, so the retainer starts in month two.",
    ],
    quoteMessage: "Hello OptimaByte, I would like to set up a maintenance retainer.",
  },

  {
    id: "changes-modifications",
    from: "KES 2,500",
    intro:
      "Once a system is live, needs change. Every change is quoted before work starts and is billed per request, on top of any retainer. Small tweaks are fixed price. Larger changes are quoted from a short description.",
    tiers: [
      {
        name: "Minor change",
        price: "KES 2,500",
        unit: "per request",
        bestFor: "Wording, colours, a label, a small layout fix or one extra field.",
        includes: [
          "Done and tested",
          "Quoted before work begins",
          "Confirmation from you before it goes live",
        ],
      },
      {
        name: "Standard change",
        price: "KES 5,000 to 15,000",
        unit: "per request",
        bestFor: "A new report, a new screen, a changed workflow or new rules for an existing feature.",
        includes: [
          "Short written scope",
          "Testing with your data",
          "Deployed after your confirmation",
        ],
        popular: true,
      },
      {
        name: "Major feature",
        price: "KES 15,000 to 80,000",
        unit: "per request, quoted after scoping",
        bestFor: "A new module, an integration with another system, or a significant redesign.",
        includes: [
          "Scoped and quoted in writing first",
          "Built and tested in stages",
          "Handover and short training if needed",
        ],
      },
    ],
    factors: [
      {
        factor: "Size and clarity of the request",
        lower: "A clear description, ideally with a screenshot, keeps the work short.",
        higher: "Vague or changing requests take longer and cost more to deliver.",
      },
      {
        factor: "Touching other parts of the system",
        lower: "The change stays in one screen or one report.",
        higher: "Changes that affect data, permissions or several screens cost more because more must be tested.",
      },
      {
        factor: "Urgency",
        lower: "Normal turnaround, communicated up front.",
        higher: "Same-day or weekend work can add about 25 to 50 percent.",
      },
    ],
    notes: [
      "No change is made without your confirmation, and the price is agreed before work begins.",
      "You can request changes directly over WhatsApp.",
    ],
    quoteMessage: "Hello OptimaByte, I would like to request a change to my system.",
  },

  // -------------------------------------------------------------------- design
  {
    id: "graphic-design",
    from: "KES 500",
    intro:
      "Design is priced by the piece. Single items are inexpensive, and a full set designed together as one brand costs less per item than ordering each one separately.",
    tiers: [
      {
        name: "Social media graphic",
        price: "KES 500 to 1,500",
        unit: "per graphic, 10-post packs about KES 4,000 to 10,000",
        bestFor: "Regular posts, promotions and announcements in your brand style.",
        includes: ["Sized for each platform", "Your colours, fonts and logo", "Delivered as image files"],
      },
      {
        name: "Flyer or poster",
        price: "KES 1,500 to 5,000",
        unit: "per design",
        bestFor: "Events, offers, menus and notices for print or sharing online.",
        includes: ["Print-ready file with correct bleed", "Source file handed over", "Digital version for WhatsApp and social"],
        popular: true,
      },
      {
        name: "Logo design",
        price: "KES 5,000 to 25,000",
        unit: "per logo",
        bestFor: "A new business or a refresh of an old mark.",
        includes: ["Concept options and refinement", "Logo in colour, black and white", "Source files"],
      },
      {
        name: "Brand and print kit",
        price: "KES 20,000 to 70,000",
        unit: "complete kit",
        bestFor: "Logo, flyers, posters, stickers and social templates designed as one consistent set.",
        includes: ["Consistent colours, type and layout", "Print-ready files for every piece", "Editable sources"],
      },
    ],
    factors: [
      {
        factor: "Revisions",
        lower: "A clear brief means fewer rounds of change.",
        higher: "Each round beyond the agreed number adds about KES 500 to 2,000.",
      },
      {
        factor: "Content supplied",
        lower: "You provide the text, logo and photos.",
        higher: "Writing the text or sourcing images and licensed fonts is added at cost.",
      },
      {
        factor: "Complexity",
        lower: "Text and simple shapes keep a design near the bottom of its range.",
        higher: "Illustration, detailed layouts and retouching push toward the top, or higher.",
      },
      {
        factor: "Turnaround",
        lower: "Standard turnaround.",
        higher: "Same-day delivery can add about 25 to 50 percent.",
      },
    ],
    notes: ["Printing is not included in design prices. Print costs depend on quantity, paper and the printer, and are quoted separately."],
    quoteMessage: "Hello OptimaByte, I would like a quote for graphic design.",
  },

  {
    id: "sticker-printing",
    from: "KES 1,500",
    intro:
      "Sticker prices depend mostly on how many you order, their size and the finish. The more you print in one run, the lower the cost per sticker. The prices below include the printing. Artwork design is a separate line so you only pay for it if you need it.",
    tiers: [
      {
        name: "Small run",
        price: "KES 1,500 to 4,000",
        unit: "about 50 to 100 stickers, up to 5 cm",
        bestFor: "Trying a design, small giveaways or labelling a few products.",
        includes: ["Standard shapes", "Matte or gloss finish", "Cut and ready to use"],
      },
      {
        name: "Standard run",
        price: "KES 5,000 to 12,000",
        unit: "about 250 to 500 stickers",
        bestFor: "Packaging, branding and regular promotional use.",
        includes: ["Die-cut or standard shapes", "Matte, gloss or waterproof finish", "Colour check before the full run"],
        popular: true,
      },
      {
        name: "Bulk run",
        price: "KES 10,000 to 30,000",
        unit: "1,000 stickers and above",
        bestFor: "Product labels and campaigns where the cost per sticker matters.",
        includes: ["Lowest cost per sticker", "Consistent colour across the run", "Packed for delivery"],
      },
      {
        name: "Sticker artwork",
        price: "KES 1,000 to 3,000",
        unit: "per design, free if you supply print-ready artwork",
        bestFor: "Customers who need the sticker designed before printing.",
        includes: ["Design in your brand style", "Print-ready file", "Source file handed over"],
      },
    ],
    factors: [
      {
        factor: "Quantity",
        lower: "Larger runs bring the cost per sticker down noticeably.",
        higher: "Very small runs cost more per sticker because setup is the same.",
      },
      {
        factor: "Size",
        lower: "Small stickers up to about 5 cm.",
        higher: "Larger stickers use more material and can double the price of the same run.",
      },
      {
        factor: "Finish and material",
        lower: "Standard matte or gloss vinyl.",
        higher: "Waterproof and outdoor-grade finishes add about 20 to 40 percent.",
      },
      {
        factor: "Shape",
        lower: "Circles, squares and rectangles.",
        higher: "Custom die-cut shapes add about KES 500 to 2,500 depending on complexity.",
      },
    ],
    notes: ["Printer prices change with paper and ink costs, so the final price is confirmed before your order is printed."],
    quoteMessage: "Hello OptimaByte, I would like a quote for sticker printing.",
  },

  {
    id: "publications",
    from: "KES 5,000",
    intro:
      "Layout for longer documents is priced mostly by page count and by how much work each page needs. Pages that are mainly text are quicker than pages with charts, photographs and tables.",
    tiers: [
      {
        name: "Brochure",
        price: "KES 5,000 to 15,000",
        unit: "2 to 8 pages",
        bestFor: "Company profiles, service brochures and menus.",
        includes: ["Print and PDF versions", "Consistent layout", "Editable source files"],
      },
      {
        name: "Report or booklet",
        price: "KES 15,000 to 50,000",
        unit: "about 12 to 40 pages, roughly KES 600 to 1,500 a page",
        bestFor: "Annual summaries, proposals, manuals and training booklets.",
        includes: ["Styles for headings, tables and captions", "Print and digital PDF", "Editable source files"],
        popular: true,
      },
      {
        name: "Catalogue",
        price: "KES 25,000 to 90,000",
        unit: "about 20 to 60 pages",
        bestFor: "Product catalogues with many photographs, prices and codes.",
        includes: ["Repeating product layout", "Print and digital versions", "Easy to update next season"],
      },
      {
        name: "Long or complex publication",
        price: "From KES 60,000",
        unit: "quoted after reviewing the content",
        bestFor: "Annual reports and publications with heavy charts, tables and many revisions.",
        includes: ["Chart and infographic design", "Staged review rounds", "Print-ready and accessible PDF"],
      },
    ],
    factors: [
      {
        factor: "Page count",
        lower: "Fewer pages, and repeated layouts, lower the price per page.",
        higher: "Every extra page adds roughly KES 600 to 1,500 depending on its content.",
      },
      {
        factor: "Charts, tables and infographics",
        lower: "Mostly text and a few images.",
        higher: "Custom charts and infographics add about KES 1,000 to 4,000 each.",
      },
      {
        factor: "Content ready",
        lower: "Final, proofread text and supplied images can reduce the quote by 10 to 20 percent.",
        higher: "Text that changes after layout starts means extra rounds of work.",
      },
      {
        factor: "Print preparation",
        lower: "Digital PDF only.",
        higher: "Print-ready files with bleed, crop marks and a proof add about KES 1,500 to 5,000.",
      },
    ],
    notes: ["Printing and binding are not included. We can advise on printers and quantities when you are ready."],
    quoteMessage: "Hello OptimaByte, I would like a quote for publication layout.",
  },
];

export const pricingGuideById = new Map(pricingGuide.map((p) => [p.id, p]));
