import { Photo } from "@/types/portfolio";

// One album per project. `album` drives the folder view in the Photos app;
// `albumUrl` links the album header to the live site.
//
// Most albums hold screens captured from the live site. Zaytoun holds the
// brand collateral produced alongside it instead — the site itself is already
// covered by its demo in public/videos, so the album shows the identity work
// rather than repeating the same screens.
export const photos: Photo[] = [
  // ---- Zaytoun ----
  {
    id: "zaytoun-origin",
    url: "/photos/zaytoun-origin.jpg",
    caption: "Origin story — the family kitchen in Jabal Al-Weibdeh.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },
  {
    id: "zaytoun-kitchen",
    url: "/photos/zaytoun-kitchen.jpg",
    caption: "Positioning card — 120 covers, cooked like a home kitchen.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },
  {
    id: "zaytoun-love",
    url: "/photos/zaytoun-love.jpg",
    caption: "Campaign key art, on the same serif and olive palette as the site.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },
  {
    id: "zaytoun-ingredients",
    url: "/photos/zaytoun-ingredients.jpg",
    caption: "Sourcing message for the social grid.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },
  {
    id: "zaytoun-ouzi",
    url: "/photos/zaytoun-ouzi.jpg",
    caption: "Signature dish card — Lamb Ouzi, priced as on the menu.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },
  {
    id: "zaytoun-reserve",
    url: "/photos/zaytoun-reserve.jpg",
    caption: "Reservations call to action.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },

  // ---- Vestra ----
  {
    id: "vestra-homepage",
    url: "/photos/vestra-homepage.jpg",
    caption: "Home — hero, proof points and the best-sellers row.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-catalogue",
    url: "/photos/vestra-catalogue.jpg",
    caption: "All jewellery — 14 pieces, filterable by category.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-rings",
    url: "/photos/vestra-rings.jpg",
    caption: "Rings — signets, bands and solitaires.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-chains",
    url: "/photos/vestra-chains.jpg",
    caption: "Chains — hand-closed links with no visible joins.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-pendants",
    url: "/photos/vestra-pendants.jpg",
    caption: "Pendants — weighted to swing, not to sit.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-earrings",
    url: "/photos/vestra-earrings.jpg",
    caption: "Earrings — studs, hoops and drops in recycled gold.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-cuffs",
    url: "/photos/vestra-cuffs.jpg",
    caption: "Cuffs — forged from a single billet.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-about",
    url: "/photos/vestra-about.jpg",
    caption: "About — the bespoke process, consultation to delivery.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-shipping",
    url: "/photos/vestra-shipping.jpg",
    caption: "Shipping — UK and international rates, duties and insurance.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-care",
    url: "/photos/vestra-care.jpg",
    caption: "Care & repair — cleaning, storage and lifetime servicing.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-contact",
    url: "/photos/vestra-contact.jpg",
    caption: "Contact — enquiry form and studio details.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },

  // ---- Cedar Stone Legal ----
  {
    id: "cedar-home",
    url: "/photos/cedar-home.jpg",
    caption: "Hero, with practice statistics.",
    date: "2026",
    album: "Cedar Stone Legal",
    albumUrl: "https://cedar-stone-legal.vercel.app/",
  },
  {
    id: "cedar-team",
    url: "/photos/cedar-team.jpg",
    caption: "Team profiles with practice area and years of experience.",
    date: "2026",
    album: "Cedar Stone Legal",
    albumUrl: "https://cedar-stone-legal.vercel.app/",
  },
  {
    id: "cedar-practice",
    url: "/photos/cedar-practice.jpg",
    caption: "Practice areas — family, corporate, estate and litigation.",
    date: "2026",
    album: "Cedar Stone Legal",
    albumUrl: "https://cedar-stone-legal.vercel.app/",
  },

  // ---- Evercare ----
  {
    id: "evercare-home",
    url: "/photos/evercare-home.jpg",
    caption: "Hero and booking entry point.",
    date: "2026",
    album: "Evercare",
    albumUrl: "https://evercare-hospital-blush.vercel.app/",
  },
  {
    id: "evercare-depts",
    url: "/photos/evercare-depts.jpg",
    caption: "Department directory.",
    date: "2026",
    album: "Evercare",
    albumUrl: "https://evercare-hospital-blush.vercel.app/",
  },
  {
    id: "evercare-appt",
    url: "/photos/evercare-appt.jpg",
    caption: "Appointment request flow.",
    date: "2026",
    album: "Evercare",
    albumUrl: "https://evercare-hospital-blush.vercel.app/",
  },
];
