import keywordsData from "../data/seo/keywords.json";
import { generateSlug } from "./seo-utils";
import { siteConfig } from "./site-config";

export type KeywordPageCategory =
  | "best"
  | "comparison"
  | "crm"
  | "booking"
  | "payments"
  | "tracking"
  | "automation"
  | "analytics"
  | "maintenance"
  | "multi-location"
  | "contactless"
  | "ai"
  | "ev"
  | "car-sharing"
  | "blockchain"
  | "how-to"
  | "features"
  | "general";

export type KeywordLandingFAQ = {
  question: string;
  answer: string;
};

export type KeywordLandingSection =
  | {
      id: string;
      heading: string;
      type: "text";
      paragraphs: string[];
    }
  | {
      id: string;
      heading: string;
      type: "bullets";
      intro?: string;
      bullets: string[];
      outro?: string;
    }
  | {
      id: string;
      heading: string;
      type: "table";
      intro?: string;
      columns: string[];
      rows: Array<Record<string, string>>;
      outro?: string;
    };

export type KeywordLandingPage = {
  keyword: string;
  slug: string;
  category: KeywordPageCategory;
  title: string;
  description: string;
  h1: string;
  updatedAtISO: string;
  toc: Array<{ id: string; label: string }>;
  sections: KeywordLandingSection[];
  faqs: KeywordLandingFAQ[];
};

const UAE_OPERATOR_ASIDES = [
  "I’ve seen this exact mistake kill cash flow for a Bur Dubai operator…",
  "One client in Al Quoz switched their setup and never looked back.",
  "Real talk: spreadsheets + WhatsApp bookings work… right until they don’t.",
  "If you’re juggling Salik, fines, and deposits manually, you’re basically paying a ‘stress tax’ in hours.",
  "Summer heat + downtime + manual reminders? Brutal combo.",
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(items: T[], seed: number, offset = 0): T {
  const idx = (seed + offset) % items.length;
  return items[idx]!;
}

function titleCase(s: string): string {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function classifyKeyword(keyword: string): KeywordPageCategory {
  const k = keyword.toLowerCase();
  if (k.includes("how to choose")) return "how-to";
  if (k.includes("features list")) return "features";
  if (k.includes("comparison") || k.includes("reviews")) return "comparison";
  if (k.includes("best")) return "best";
  if (k.includes("crm")) return "crm";
  if (k.includes("booking") || k.includes("reservation")) return "booking";
  if (k.includes("payment") || k.includes("invoicing")) return "payments";
  if (k.includes("gps") || k.includes("tracking") || k.includes("real-time fleet")) return "tracking";
  if (k.includes("automation") || k.includes("digital transformation")) return "automation";
  if (k.includes("analytics") || k.includes("optimization")) return "analytics";
  if (k.includes("maintenance")) return "maintenance";
  if (k.includes("multi-location")) return "multi-location";
  if (k.includes("contactless") || k.includes("check-in")) return "contactless";
  if (k.includes("ai")) return "ai";
  if (k.includes("ev") || k.includes("electric vehicle")) return "ev";
  if (k.includes("car sharing")) return "car-sharing";
  if (k.includes("blockchain")) return "blockchain";
  return "general";
}

function buildTitle(keyword: string, category: KeywordPageCategory, seed: number): string {
  const year = "2026";
  const base = titleCase(keyword);

  const variants: string[] = [
    `${base} (UAE) — What Actually Works in Dubai & Abu Dhabi`,
    `${base} — UAE Operator Guide for ${year}`,
    `${base} — Shortlist, Checklist & UAE Must‑Haves`,
  ];

  // Keep titles from getting ridiculously long.
  const t = pick(variants, seed);
  return t.length > 70 ? `${base} (UAE) — ${year} Guide` : t;
}

function buildDescription(keyword: string, category: KeywordPageCategory, seed: number): string {
  const k = keyword.toLowerCase();
  const cityHint = k.includes("dubai") ? "Dubai" : k.includes("abu dhabi") ? "Abu Dhabi" : "UAE";

  const variants: string[] = [
    `Looking for ${keyword} in ${cityHint}? Here’s a practical 2026 checklist: Salik/fines handling, Arabic/English, deposits, payments, GPS, maintenance, and what to demo before you commit.`,
    `${keyword} isn’t just “features” in the UAE — it’s compliance, speed, and cash flow. Use this guide to compare options, avoid common traps, and shortlist tools that fit your fleet.`,
    `A UAE-first breakdown of ${keyword}: must-have modules, red flags, pricing reality, and a simple demo scorecard you can use this week.`,
  ];

  return pick(variants, seed);
}

function buildIntro(keyword: string, seed: number): string[] {
  const asidesCount = 1 + (seed % 2);
  const aside1 = pick(UAE_OPERATOR_ASIDES, seed, 0);
  const aside2 = pick(UAE_OPERATOR_ASIDES, seed, 2);
  const chosenAsides = [aside1, aside2].slice(0, asidesCount);

  return [
    `If you’re searching for **${keyword}** in 2026, you’re probably feeling the same UAE pain I hear every week: bookings coming from everywhere, deposits and damages getting messy, and Salik/fines turning into a surprise “second invoice”.`,
    `Look, the “best” tool here isn’t the one with the longest feature list — it’s the one that keeps your ops tight when it’s 45°C, your fleet’s rotating fast, and a customer is arguing a scratch at handover. ${chosenAsides.join(" ")}`,
    `Below is a practical landing page (not brochure fluff): what to prioritize in the UAE, what to ignore, and how to test a few systems quickly without burning weeks.`,
  ];
}

function buildUaeMustHaveTable(keyword: string): KeywordLandingSection {
  return {
    id: "uae-must-haves",
    heading: "Must‑Have UAE Features (Non‑Negotiable in 2026)",
    type: "table",
    intro:
      "If your software can’t handle these cleanly, you’ll feel it in cash flow, customer disputes, and staff time.",
    columns: ["UAE requirement", "Why it matters", "What to look for in a demo"],
    rows: [
      {
        "UAE requirement": "Toll + fines workflow (Salik / Darb + traffic fines)",
        "Why it matters": "Stops leakage and awkward after-the-fact chasing",
        "What to look for in a demo":
          "Auto-import or clean CSV workflow + customer chargeback handling",
      },
      {
        "UAE requirement": "Deposits + damage capture",
        "Why it matters": "Reduces disputes and chargeback risk",
        "What to look for in a demo":
          "Photo/video check-in/out, time-stamps, signatures, damage map",
      },
      {
        "UAE requirement": "Arabic/English (at least admin + contracts)",
        "Why it matters": "Staff speed + customer trust",
        "What to look for in a demo":
          "UI language toggle + bilingual docs/templates",
      },
      {
        "UAE requirement": "VAT-ready invoicing + audit trail",
        "Why it matters": "Cleaner accounting and fewer “where did this charge come from?” moments",
        "What to look for in a demo":
          "Invoice numbering, VAT fields, exports, role permissions",
      },
      {
        "UAE requirement": "Fleet availability + overbooking protection",
        "Why it matters": "Prevents double-bookings during peak",
        "What to look for in a demo":
          "Calendar views, vehicle status, buffer rules, holds",
      },
      {
        "UAE requirement": "Maintenance + downtime tracking",
        "Why it matters": "Summer breakdowns and missed servicing kill margins",
        "What to look for in a demo":
          "Alerts, odometer tracking, workshop jobs, downtime reasons",
      },
    ],
    outro:
      `Even if you’re evaluating ${keyword}, these “boring” workflows are the difference between a tool that feels nice… and a tool that actually runs your fleet.`,
  };
}

function buildCategorySections(page: { keyword: string; category: KeywordPageCategory }): KeywordLandingSection[] {
  const { keyword, category } = page;

  const realityCheck: KeywordLandingSection = {
    id: "reality-check",
    heading: "2026 UAE Rental Reality Check (Before You Buy Anything)",
    type: "bullets",
    intro:
      "The market’s not slowing down — but the operational chaos gets more expensive every year.",
    bullets: [
      "Tourism demand keeps spikes unpredictable (weekends/events/seasonality).",
      "Customers expect contactless flows, instant quotes, and online payments.",
      "EV adoption is real, but it adds charging + range + downtime planning.",
      "Compliance pressure is higher (fines, documentation, audit trails).",
      "Big chains and app-based platforms push margins tighter for independents.",
    ],
    outro:
      "So when you pick software, prioritize fewer manual touchpoints and fewer disputes — not fancy dashboards nobody checks.",
  };

  const shortlist: KeywordLandingSection = {
    id: "shortlist",
    heading: "A Fast Shortlist Method (The “2‑Week Demo Rule”)",
    type: "bullets",
    intro:
      "If you can’t validate a system in 10–14 days, you’ll end up stuck in a long implementation with low adoption.",
    bullets: [
      "Run a live pilot with 10–20 vehicles, not the whole fleet.",
      "Test deposit capture + damage evidence end-to-end (photos, signatures, chargebacks).",
      "Import 50 real bookings and verify availability rules don’t create overbooking.",
      "Simulate fines/toll charges and see how billing looks on an invoice.",
      "Make your front desk team try it on mobile — if they hate it, it won’t stick.",
    ],
    outro:
      `Among the cloud-first options, it’s worth comparing a mobile-first system like ${siteConfig.promotedSites.autycloud.name} (see ${siteConfig.promotedSites.autycloud.url}/features) alongside any local tools you’re considering — not because it’s “best for everyone”, but because the UX + real-time ops are usually where spreadsheets finally break.`,
  };

  const pricingReality: KeywordLandingSection = {
    id: "pricing",
    heading: "Pricing Reality (What You Actually Pay in the UAE)",
    type: "text",
    paragraphs: [
      "Most vendors will quote “per vehicle per month” and then quietly charge extra for add-ons: tracking, payments, SMS/WhatsApp, extra users, extra locations, and integrations.",
      "My rule: don’t compare by the base subscription. Compare by **your real workflow**: bookings + payments + deposits + fines + maintenance + reporting. That’s the bill that matters.",
      `If you want a quick sanity check on transparent plans, skim ${siteConfig.promotedSites.autycloud.url}/pricing before you negotiate with anyone — even if you don’t pick it, it helps you anchor what “fair pricing” looks like.`,
    ],
  };

  const categoryAngle: Record<KeywordPageCategory, KeywordLandingSection> = {
    best: {
      id: "best-fit",
      heading: "What “Best” Means (Small Fleet vs 100+ Cars vs Luxury)",
      type: "bullets",
      intro: "The UAE “best” depends on fleet size, customer type, and how much chaos you can tolerate.",
      bullets: [
        "**10–50 cars (independents)**: fast setup, mobile check-in/out, deposits, simple payments, clear reporting.",
        "**50–200 cars**: role permissions, multi-location, maintenance + downtime, stronger audit trails, integrations.",
        "**Luxury / performance fleets**: damage capture + evidence, deposit discipline, VIP workflows, stricter contracts.",
        "**EV-heavy fleets**: charging logs, range planning, downtime reasons, driver education content baked in.",
      ],
      outro: "If a vendor can’t clearly say which bracket they’re best for, that’s usually your answer.",
    },
    comparison: {
      id: "comparison-angle",
      heading: "How to Compare Tools Without Getting Tricked by Demos",
      type: "bullets",
      intro: "Demos are designed to impress. Your job is to break the product (politely).",
      bullets: [
        "Ask them to run your exact workflow: deposit → check-out → fine → invoice → refund.",
        "Check how cancellations/refunds are logged (audit trail matters).",
        "Look for role permissions (front desk vs ops vs finance).",
        "Ask about data export and offboarding (yes, from day one).",
        "Test mobile experience — UAE ops happen on phones, not desktops.",
      ],
    },
    crm: {
      id: "crm-angle",
      heading: "CRM for Rentals (It’s Not a “Nice-to-Have” Anymore)",
      type: "text",
      paragraphs: [
        "Most UAE operators lose repeat business because follow-ups are messy: WhatsApp threads, random notes, and staff turnover.",
        "A proper rental CRM means: lead capture, quote history, repeat-customer pricing, blacklists, and clean communication logs.",
        "If your CRM and booking system are separate, make sure they sync perfectly — otherwise you’ll duplicate work and miss follow-ups.",
      ],
    },
    booking: {
      id: "booking-angle",
      heading: "Booking Systems in Dubai (What Matters in Real Life)",
      type: "bullets",
      intro: "Dubai demand swings hard. Your booking system must protect availability and margins.",
      bullets: [
        "Availability buffers (cleaning, delivery time, late returns).",
        "Online payments + deposit capture that finance can reconcile.",
        "Instant quote rules (seasonality, weekends, events).",
        "Multi-channel bookings (website + walk-ins + WhatsApp leads).",
      ],
    },
    payments: {
      id: "payments-angle",
      heading: "Payments & Invoicing (The Part That Saves You or Sinks You)",
      type: "bullets",
      intro: "If money tracking is fuzzy, everything else becomes an argument.",
      bullets: [
        "Online payment links + clear receipts (customers screenshot everything).",
        "Deposit holds vs charges (don’t mix them up).",
        "VAT-friendly invoicing + exports for your accountant.",
        "Refund workflows that are tracked (who approved, when, why).",
      ],
    },
    tracking: {
      id: "tracking-angle",
      heading: "Fleet Tracking & GPS (Use It for Ops, Not Micromanaging)",
      type: "bullets",
      intro: "Tracking pays for itself when you use it for the right problems.",
      bullets: [
        "Theft recovery and geofencing (especially for high-risk segments).",
        "Delivery/pickup efficiency (dispatching and ETAs).",
        "Odometer automation for maintenance schedules.",
        "Dispute resolution (“where was the car?”) with time-stamped logs.",
      ],
    },
    automation: {
      id: "automation-angle",
      heading: "Automation That Actually Helps (Not Automation Theatre)",
      type: "bullets",
      intro: "Automate the repetitive stuff first — that’s where the margin is hiding.",
      bullets: [
        "Auto reminders (documents, payments, returns).",
        "Status workflows (available → reserved → on rent → cleaning → maintenance).",
        "Auto invoicing after return + add-ons (Salik, fines, fuel policy).",
        "Daily ops reports sent to WhatsApp/email for the team lead.",
      ],
    },
    analytics: {
      id: "analytics-angle",
      heading: "Analytics & Optimization (The KPIs That Move UAE Margins)",
      type: "bullets",
      intro: "You don’t need 100 charts. You need 8 numbers you trust.",
      bullets: [
        "Utilization by vehicle class (and by day of week).",
        "Revenue per available car day (RACD) + downtime cost.",
        "Damage rate and average damage recovery time.",
        "Late return frequency + who/why.",
        "Channel profitability (website vs brokers vs walk-ins).",
      ],
    },
    maintenance: {
      id: "maintenance-angle",
      heading: "Preventive Maintenance (Where UAE Heat Punishes Lazy Systems)",
      type: "text",
      paragraphs: [
        "In the UAE, maintenance isn’t “admin”. It’s uptime, and uptime is profit.",
        "The best maintenance module ties service intervals to real odometer readings, tracks downtime reasons, and makes workshop handoffs obvious.",
        "If you can’t see downtime cost per vehicle, you’ll keep the wrong cars too long.",
      ],
    },
    "multi-location": {
      id: "multi-location-angle",
      heading: "Multi‑Location Ops (Dubai + Abu Dhabi + Sharjah Without the Mess)",
      type: "bullets",
      intro: "Once you run more than one branch, weak software turns into internal arguments.",
      bullets: [
        "Branch-level inventory + transfers (with approvals).",
        "Role permissions per location.",
        "Location-based pricing rules and delivery zones.",
        "Centralized finance reporting (one truth).",
      ],
    },
    contactless: {
      id: "contactless-angle",
      heading: "Contactless Check‑In/Out (The UAE Standard Now)",
      type: "bullets",
      intro: "Contactless isn’t about being fancy — it’s about speed and fewer disputes.",
      bullets: [
        "ID/license upload + verification workflow.",
        "Digital signatures + time-stamped handover checklist.",
        "Damage photos/videos captured in the same flow.",
        "Payment links + deposit capture before delivery.",
      ],
    },
    ai: {
      id: "ai-angle",
      heading: "AI in Car Rental Software (Useful, But Don’t Get Played)",
      type: "bullets",
      intro: "AI is great when it’s measurable. Ignore buzzwords.",
      bullets: [
        "Dynamic pricing suggestions based on utilization and seasonality.",
        "Fraud/risk flags (repeat offenders, document mismatches).",
        "Maintenance anomaly detection from usage patterns.",
        "Automated reporting summaries for ops leads.",
      ],
      outro:
        "If a vendor can’t show you a before/after KPI in a pilot, treat “AI” as marketing.",
    },
    ev: {
      id: "ev-angle",
      heading: "EV Fleet Management in the UAE (What Software Must Track)",
      type: "bullets",
      intro: "EVs can be profitable — but only if your ops and software are disciplined.",
      bullets: [
        "Charging schedule + charger locations per branch.",
        "Range planning notes for customers (reduces angry calls).",
        "Battery health / usage logs (even basic tracking helps resale value).",
        "Downtime reasons (charging vs maintenance vs accident).",
      ],
    },
    "car-sharing": {
      id: "car-sharing-angle",
      heading: "Car Sharing Management (More Automation, Less Tolerance for Errors)",
      type: "bullets",
      intro: "Car sharing is rentals on hard mode: higher volume, smaller mistakes become bigger losses.",
      bullets: [
        "Instant identity verification + strict access rules.",
        "Automated unlock/lock workflows (if you integrate hardware).",
        "Real-time availability + location accuracy.",
        "Automated cleaning/turnaround scheduling.",
      ],
    },
    blockchain: {
      id: "blockchain-angle",
      heading: "Blockchain Rental Agreements (Interesting… but Be Practical)",
      type: "text",
      paragraphs: [
        "Blockchain contracts sound cool, but most UAE rental businesses don’t need it yet.",
        "If you’re exploring this, focus on the real value: tamper-proof agreement history and dispute evidence — not tokens.",
        "In 2026, your bigger wins are still: deposits, damage capture, fines, and faster booking/payment flows.",
      ],
    },
    "how-to": {
      id: "how-to-angle",
      heading: "How to Choose (A Simple Scorecard You Can Use Today)",
      type: "bullets",
      intro: "Print this, score each demo 1–5, and don’t let anyone distract you.",
      bullets: [
        "Does it reduce disputes (damage/deposit evidence)?",
        "Does it reduce leakage (fines/tolls/add-ons + invoicing)?",
        "Does staff adopt it fast (mobile-first, simple flows)?",
        "Does it scale (roles, multi-location, exports)?",
        "Is pricing transparent (or full of surprise add-ons)?",
      ],
    },
    features: {
      id: "features-angle",
      heading: "Feature List (UAE-Friendly Checklist)",
      type: "bullets",
      intro: "Here’s the feature list I’d actually use to evaluate rental software in the Emirates.",
      bullets: [
        "Bookings + availability + buffers",
        "Deposits, damages, claims evidence",
        "Fines/tolls workflows (Salik/Darb)",
        "Online payments + invoicing + VAT fields",
        "GPS/telematics (optional but useful at scale)",
        "Maintenance scheduling + downtime reporting",
        "Multi-location transfers + permissions",
        "Exports + audit trail",
      ],
    },
    general: {
      id: "general-angle",
      heading: "What to Focus on First (If You’re Overwhelmed)",
      type: "bullets",
      intro: "Start with the modules that stop leakage and reduce disputes.",
      bullets: [
        "Deposits + damage capture",
        "Availability + overbooking protection",
        "Payments + invoicing + VAT fields",
        "Maintenance + downtime tracking",
      ],
    },
  };

  return [realityCheck, buildUaeMustHaveTable(keyword), categoryAngle[category], pricingReality, shortlist];
}

function buildFaqs(keyword: string, category: KeywordPageCategory, seed: number): KeywordLandingFAQ[] {
  const base: KeywordLandingFAQ[] = [
    {
      question: `Does ${keyword} handle Salik / Darb and traffic fines automatically?`,
      answer:
        "Some tools do, many don’t. In your demo, ask for the exact workflow: import fines/tolls → attribute to booking → invoice add-on → payment/refund handling. If they can’t show it, assume it’s manual.",
    },
    {
      question: "Do I need Arabic support for UAE rental operations?",
      answer:
        "Not always for customers, but it helps for staff and documentation. At minimum, check bilingual templates, clear contracts, and easy-to-understand receipts/invoices.",
    },
    {
      question: "What’s the biggest mistake operators make when buying rental software?",
      answer:
        "Buying based on price or “AI” claims instead of workflows. If deposits, damage capture, fines/tolls, and invoicing aren’t solid, you’ll pay for it every day.",
    },
    {
      question: "How long should implementation take for a small UAE fleet?",
      answer:
        "If it’s cloud-based and the vendor is organized, you can pilot in 10–14 days. Full rollout depends on training, data cleanup, and integrations, but you should see value in the first month.",
    },
    {
      question: "Should I choose an all-in-one platform or separate tools?",
      answer:
        "All-in-one is usually easier for small teams. Separate tools can work if integrations are strong and your team can manage them. The key is avoiding duplicate data entry.",
    },
    {
      question: "What should I test in a demo before paying anything?",
      answer:
        "Run deposit + check-in/out + damage evidence, then simulate a fine/toll add-on, then invoice/export to accounting. Also test the mobile flow with your front desk staff.",
    },
    {
      question: "Is GPS tracking worth it for rentals?",
      answer:
        "For many fleets, yes — when used for recovery, dispatch, and dispute resolution. It’s less about spying and more about operational control and protecting assets.",
    },
    {
      question: "Where can I see a modern rental/fleet software demo?",
      answer:
        `If you’re comparing cloud-first tools, you can book a quick product walkthrough at ${siteConfig.promotedSites.autycloud.url}/demo and use the scorecard on this page to judge it fairly.`,
    },
  ];

  // Tiny deterministic rotation so not every page has identical ordering.
  const rotation = seed % 3;
  return [...base.slice(rotation), ...base.slice(0, rotation)];
}

function buildToc(sections: KeywordLandingSection[]): Array<{ id: string; label: string }> {
  return sections.map((s) => ({ id: s.id, label: s.heading }));
}

export function buildKeywordLandingPages(): KeywordLandingPage[] {
  const keywords = Array.isArray(keywordsData?.keywords) ? keywordsData.keywords : [];
  const updatedAtISO = new Date().toISOString();

  const pages = keywords
    .map((keywordRaw) => String(keywordRaw).trim())
    .filter(Boolean)
    .map((keyword) => {
      const seed = hashString(keyword);
      const category = classifyKeyword(keyword);
      const slug = generateSlug(keyword);

      const title = buildTitle(keyword, category, seed);
      const description = buildDescription(keyword, category, seed);
      const h1 = titleCase(keyword) + " (UAE)";

      const sections = [
        {
          id: "intro",
          heading: `${titleCase(keyword)} — UAE Quick Take`,
          type: "text" as const,
          paragraphs: buildIntro(keyword, seed),
        },
        ...buildCategorySections({ keyword, category }),
        {
          id: "sources",
          heading: "Sources & Further Reading (UAE + Software Directories)",
          type: "bullets" as const,
          intro: "Use these to sanity-check claims and see broader vendor lists.",
          bullets: [
            "RTA Dubai (rules and updates): https://www.rta.ae",
            "GetApp UAE car rental software listings: https://www.getapp.ae/directory/309/car-rental/software",
            "Capterra car rental software: https://www.capterra.com/car-rental-software/",
            "SoftwareSuggest UAE car rental software: https://www.softwaresuggest.com/car-rental-software/uae",
          ],
        },
      ];

      return {
        keyword,
        slug,
        category,
        title,
        description,
        h1,
        updatedAtISO,
        toc: buildToc(sections),
        sections,
        faqs: buildFaqs(keyword, category, seed),
      } satisfies KeywordLandingPage;
    })
    .filter((p) => p.slug.length > 0);

  // Ensure uniqueness on slugs (just in case)
  const seen = new Set<string>();
  const unique: KeywordLandingPage[] = [];
  for (const p of pages) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    unique.push(p);
  }

  return unique;
}

export const keywordLandingPages: KeywordLandingPage[] = buildKeywordLandingPages();

export function getKeywordLandingPageBySlug(slug: string): KeywordLandingPage | null {
  const normalized = slug.trim().toLowerCase();
  return keywordLandingPages.find((p) => p.slug === normalized) || null;
}

export function getRelatedKeywordLandingPages(
  slug: string,
  options: { limit?: number } = {}
): KeywordLandingPage[] {
  const { limit = 8 } = options;
  const current = getKeywordLandingPageBySlug(slug);
  if (!current) return [];

  const sameCategory = keywordLandingPages
    .filter((p) => p.slug !== current.slug && p.category === current.category)
    .slice(0, Math.max(3, Math.floor(limit / 2)));

  const rest = keywordLandingPages
    .filter((p) => p.slug !== current.slug && p.category !== current.category)
    .slice(0, Math.max(0, limit - sameCategory.length));

  return [...sameCategory, ...rest].slice(0, limit);
}

