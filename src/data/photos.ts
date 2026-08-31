import { Photo } from "@/types/portfolio";

// Screens captured from the live client sites, grouped into an album per
// project. `album` drives the folder view in the Photos app; `albumUrl` links
// the album header to the live site.
export const photos: Photo[] = [
  // ---- Zaytoun ----
  {
    id: "zaytoun-home",
    url: "/photos/zaytoun-home.jpg",
    caption: "Hero — bilingual Arabic/English fine dining in Amman.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },
  {
    id: "zaytoun-menu",
    url: "/photos/zaytoun-menu.jpg",
    caption: "Menu, with dietary markers and course filtering.",
    date: "2026",
    album: "Zaytoun",
    albumUrl: "https://zaytoun-restaurant.vercel.app/",
  },

  // ---- Vestra ----
  {
    id: "vestra-home",
    url: "/photos/vestra-home.jpg",
    caption: "Hero — jewellery in recycled gold, made to order.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-shop",
    url: "/photos/vestra-shop.jpg",
    caption: "Collection grid with category filtering.",
    date: "2026",
    album: "Vestra",
    albumUrl: "https://vestra-eta.vercel.app/",
  },
  {
    id: "vestra-atelier",
    url: "/photos/vestra-atelier.jpg",
    caption: "Atelier — the commission process, step by step.",
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
