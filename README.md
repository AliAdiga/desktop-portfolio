# Portfolio Site

A portfolio site that behaves like **macOS on desktop** and **iOS on mobile** — one
codebase, two experiences. Built with Next.js 16, Tailwind CSS v4, and Framer Motion.

Built on top of [bymanOS](https://github.com/byma4n/bymanOS) by Byman (MIT licensed
— see `LICENSE`), heavily customized. That attribution and the `LICENSE` file need to
stay; everything else here is ours.

**Run it:** `npm install`, then `npm run dev` → [localhost:3000](http://localhost:3000)

---

## Where the content lives

All content is data-driven from `src/data/` — no component edits needed for copy changes.

| File | What it controls |
|---|---|
| `profile.ts` | Name, role, bio, avatar, email, location, phone, social links. **Also drives the browser tab title and share cards.** |
| `videos.ts` | The "untitled videos" reel book. Files go in `public/videos/`, posters in `public/videos/posters/`. |
| `magazine.ts` | The paginated Magazine app. Images go in `public/magazine/`. |
| `about.ts` | About page content. |
| `portfolio.ts` | Wallpaper (`theme.wallpaperUrl`). |
| `appRegistry.ts` | Which apps exist, their icons, window sizes, and visibility. |
| `projects.ts`, `skills.ts`, `experience.ts`, `notes.ts`, `photos.ts`, `playlist.ts` | Inherited template apps — currently hidden from the desktop. Edit or remove as needed. |

## Before going live

- [ ] Fill in `src/data/profile.ts` — the tab title and all SEO metadata derive from it.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain (used to resolve share-image URLs).
- [ ] Add a share image at `public/og.jpg` (1200×630) and uncomment the `images`
      entries in `src/app/layout.tsx`.
- [ ] Replace `src/app/favicon.ico` — it's still the default Next.js/Vercel triangle.

## Current state

The desktop deliberately shows **one icon only** ("untitled videos") per the client's
launch request. Everything else is built and working, just hidden:

- Per-app visibility lives in `src/data/appRegistry.ts` (`showOnDesktop`, `showOnDock`,
  `showOnMobile`). Flip `showOnDesktop` back to `true` to bring an app back.
- The scattered per-video/per-photo desktop icons are behind the
  `SHOW_INDIVIDUAL_WORK_ICONS` flag in `src/components/desktop/DesktopView.tsx`.
- The top menu bar (name + clock + search) has been removed from `DesktopView.tsx`.
  `MenuBar.tsx` and `SpotlightSearch.tsx` still exist but are unreachable from the UI.

## What was added on top of the template

- **Videos app** — a real page-flip book (`react-pageflip`) with the video on the right
  page and its write-up on the left. `VideosWindow.tsx` / `VideosApp.tsx`.
- **Magazine app** — same flip mechanic, single-page. `MagazineWindow.tsx` / `MagazineApp.tsx`.
- The boot screen was removed.

Both were ported from an earlier vanilla HTML/CSS/JS build kept in `_legacy-vanilla-site/`.

## Adding a new app

**1.** Create the two components:

```
src/components/desktop/windows/BlogWindow.tsx
src/components/mobile/sections/BlogApp.tsx
```

**2.** Register them in `src/components/shared/appComponents.tsx`:

```tsx
// desktopComponentMap
blog: (data) => <BlogWindow data={data} />,
// mobileComponentMap
blog: (data) => <BlogApp data={data} />,
```

**3.** Add an entry to `src/data/appRegistry.ts`:

```ts
{
  id: "blog",
  label: "Blog",
  iconName: "BookOpen",
  iconColor: "text-rose-400",
  mobileColor: "bg-rose-500",
  windowSize: { maxWidth: "max-w-3xl", height: "h-[600px]" },
}
```

It then appears automatically on the desktop, dock, and mobile home screen.

## Deep linking

Every app has a direct URL — `/videos`, `/magazine`, `/about`, `/projects`, `/skills`,
`/experience`, `/music`, `/notes`, `/photos`, `/terminal` — which opens straight into
that window (desktop) or app (mobile).

## Deployment

Push to GitHub, then import the repo at [Vercel](https://vercel.com/) and deploy with
the default Next.js settings. Remember to set `NEXT_PUBLIC_SITE_URL` as an environment
variable there.

## License

MIT — see [LICENSE](LICENSE).
