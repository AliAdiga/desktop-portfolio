# Portfolio — Desktop

A macOS/iOS-style interactive desktop, built with plain HTML/CSS/JS (no build step, no dependencies).

## Running it

Open `index.html` directly in a browser, or use the VS Code "Live Server" extension
(right-click `index.html` → "Open with Live Server") for auto-reload while editing.

## How it works

- **`index.html`** — page structure: menu bar, desktop, window layer, magazine overlay, video lightbox, dock.
- **`css/style.css`** — all styling (dark theme, glass window chrome, animations).
- **`js/data.js`** — **the only file you need to edit to add content.** Everything on the
  desktop (folders, videos, magazine pages) is generated from the `FOLDERS` array here.
- **`js/app.js`** — window manager, drag/zoom/minimize, magazine paging, video lightbox.
  You shouldn't need to touch this unless you want to change behavior.

## Adding a new folder of videos

Open `js/data.js` and add an object to the `FOLDERS` array:

```js
{
  id: "another-folder",       // unique id
  name: "Client Work",        // label shown under the folder icon
  type: "videos",
  items: [
    { title: "Project Name", src: "assets/videos/project.mp4", poster: "assets/videos/posters/project.jpg" }
  ]
}
```

Drop the actual `.mp4` files into `assets/videos/` and thumbnail images into
`assets/videos/posters/`. `poster` is optional — tiles without one show a clean
placeholder tile until you add an image.

## Adding a new magazine-style folder

Add an object with `type: "magazine"` and a `pages` array:

```js
{
  id: "lookbook",
  name: "Lookbook",
  type: "magazine",
  pages: [
    { kind: "cover", title: "ISSUE 02", subtitle: "Spring", image: "assets/magazine/cover.jpg" },
    { kind: "spread", heading: "Chapter One", body: "Story text goes here.", image: "assets/magazine/01.jpg" }
  ]
}
```

Opening a magazine folder launches an immersive full-screen page viewer (swipe,
arrow buttons, dot navigation, or arrow keys). The `×` button in the top-right
always returns to the desktop.

## Interactions already wired up

- Double-click (or double-tap) a folder to open it.
- Windows open with a "genie" animation from the folder icon, are draggable by the
  title bar, and support the three traffic lights: red closes, yellow minimizes to
  the Finder icon in the dock, green toggles a larger/smaller size.
- Clicking the Finder dock icon restores the most recently minimized window.
- The Mail dock icon opens a `mailto:` link — set your address in `CONTACT_EMAIL`
  at the top of `js/data.js` to enable it.
- `Esc` closes the frontmost window, the magazine viewer, or the video lightbox.
- Motion respects `prefers-reduced-motion`.

## Deploying

This is a fully static site — any static host works (GitHub Pages, Netlify,
Vercel, etc.). Just upload the whole folder as-is.
