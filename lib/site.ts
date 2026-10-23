// Plain data and constants. No React, no icons, so it is safe to import anywhere.

export const PHONE = "+254 705 440776";
export const PHONE_LINK = "tel:+254705440776";
export const WHATSAPP = "https://wa.me/254705440776";
export const EMAIL = "contact@countymovers.co.ke";

// Images live in /public/images and are referenced by URL.
export const IMG = {
  logo: "/images/logo.jpeg",
  hero: "/images/county-hero.jpg",
  about: "/images/county-about.jpg",
  team: "/images/county-team.jpg",
  packing: "/images/county-packing.jpg",
};

/** Single source of truth for services. Icons are attached in lib/services.ts (server only). */
export const serviceItems = [
  {
    title: "Residential & Office Relocation",
    short: "Planned moves for homes and businesses",
    text: "A fresh start, without the heavy lifting. Thoughtfully planned moves for your home or business.",
  },
  {
    title: "Loading & Transportation",
    short: "Careful loading and door-to-door transport",
    text: "From your doorstep to your destination, your belongings are carefully loaded and transported.",
  },
  {
    title: "Installation Services",
    short: "Furniture, fittings and appliance set-up",
    text: "Get comfortable sooner with help setting up your furniture, fittings and appliances.",
  },
  {
    title: "Storage Services",
    short: "Space for your belongings between moves",
    text: "Need a little space between moves? Ask us about storage options for your belongings.",
  },
  {
    title: "Furniture Handling",
    short: "Dismantling, wrapping and reassembly",
    text: "Careful dismantling, wrapping and reassembly for the pieces that make your house a home.",
  },
  {
    title: "Packing & Unpacking",
    short: "Packing with care, and settling you in",
    text: "From your favourite mug to your biggest box, we pack with care and help you settle in.",
  },
];

/** Single source of truth for areas. Used by the navbar dropdown and the Service Areas section. */
export const nairobiAreas = [
  "Donholm", "Embakasi", "Buruburu", "Umoja",
  "Kilimani", "Kileleshwa", "Westlands", "Lavington",
  "Karen", "Lang’ata", "South B", "South C",
];
export const kenyaAreas = [
  "Ruiru", "Thika", "Kiambu", "Kitengela",
  "Athi River", "Machakos", "Nakuru", "Naivasha",
  "Mombasa", "Kisumu", "Eldoret", "Nyeri",
];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export type NavLink = { label: string; href: string; text?: string };
export type NavGroup = { title?: string; links: NavLink[] };
export type NavMenu = { variant: "services" | "areas"; groups: NavGroup[]; cta?: NavLink };
export type NavItem = { label: string; href: string; menu?: NavMenu };

export const nav: NavItem[] = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  {
    href: "#services",
    label: "Services",
    menu: {
      variant: "services",
      groups: [
        {
          links: serviceItems.map((s) => ({ label: s.title, href: "#services", text: s.short })),
        },
      ],
      cta: { label: "Get a free quote", href: "/quotation" },
    },
  },
  {
    href: "#areas",
    label: "Service Area",
    menu: {
      variant: "areas",
      groups: [
        { title: "In & around Nairobi", links: nairobiAreas.map((a) => ({ label: a, href: "#areas" })) },
        { title: "Across Kenya", links: kenyaAreas.map((a) => ({ label: a, href: "#areas" })) },
      ],
      cta: { label: "Somewhere else? Ask about your area", href: "#contact" },
    },
  },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export const faqs = [
  {
    q: "Do you provide packing and unpacking services?",
    a: "Yes. Packing and unpacking are part of our services. Tell us what needs to be packed when requesting your quote so we can plan for your move.",
  },
  {
    q: "Can you help with an office move?",
    a: "Yes. County Movers handles both residential and office relocation. Share your office location, destination and preferred date so we can discuss the details.",
  },
  {
    q: "Can you dismantle and reassemble furniture?",
    a: "Yes. Our furniture handling service includes dismantling, wrapping and reassembly. Let us know which pieces need attention when you enquire.",
  },
  {
    q: "How do I schedule my move?",
    a: "Send us your move details using the quote form, or get in touch by phone or WhatsApp. We will discuss the scope, availability and quote with you before confirming your move.",
  },
];

export const gallery = [
  { src: IMG.hero, alt: "Movers carrying a box beside a moving van" },
  { src: IMG.packing, alt: "Carefully packed boxes and protected furniture" },
  { src: IMG.about, alt: "Mover carrying packed boxes" },
  { src: IMG.team, alt: "Movers carefully loading a wrapped sofa" },
  { src: IMG.packing, alt: "Furniture wrapped and ready for a move" },
  { src: IMG.hero, alt: "A moving team outside an apartment" },
];


export type Review = {
  name: string;
  area: string;
  service: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
};

// PLACEHOLDERS: replace with real customer reviews before launch.
export const reviews: Review[] = [
  {
    name: "Customer name",
    area: "Kilimani, Nairobi",
    service: "Residential relocation",
    rating: 5,
    text: "Replace this with a real review from a customer who has moved with you.",
  },
  {
    name: "Customer name",
    area: "Westlands, Nairobi",
    service: "Office relocation",
    rating: 5,
    text: "Replace this with a real review from a customer who has moved with you.",
  },
  {
    name: "Customer name",
    area: "Donholm, Nairobi",
    service: "Packing & unpacking",
    rating: 4,
    text: "Replace this with a real review from a customer who has moved with you.",
  },
];