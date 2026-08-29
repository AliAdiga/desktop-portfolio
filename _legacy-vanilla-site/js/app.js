/**
 * Desktop OS simulation — window management, folders, magazine viewer.
 * Content comes entirely from js/data.js (FOLDERS, CONTACT_EMAIL).
 */
(function () {
  "use strict";

  const iconField = document.getElementById("iconField");
  const windowLayer = document.getElementById("windowLayer");
  const activeAppName = document.getElementById("activeAppName");
  const menubarItems = document.getElementById("menubarItems");
  const clockEl = document.getElementById("menubarClock");
  const dock = document.getElementById("dock");
  const profileCard = document.getElementById("profileCard");

  const IDLE_APP_NAME = typeof SITE_NAME === "string" && SITE_NAME ? SITE_NAME : "Portfolio";

  const magazineOverlay = document.getElementById("magazineOverlay");
  const magazineStage = document.getElementById("magazineStage");
  const magazineDots = document.getElementById("magazineDots");
  const magazineClose = document.getElementById("magazineClose");
  const magazinePrev = document.getElementById("magazinePrev");
  const magazineNext = document.getElementById("magazineNext");

  const lightbox = document.getElementById("videoLightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxClose = document.getElementById("lightboxClose");

  let zCounter = 10;
  let openWindows = {}; // id -> element
  let minimizedStack = []; // { id, el, homeRect }

  // ---------- Clock ----------
  function updateClock() {
    const now = new Date();
    const opts = { weekday: "short", month: "short", day: "numeric" };
    const dateStr = now.toLocaleDateString(undefined, opts);
    const timeStr = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    clockEl.textContent = `${dateStr}  ${timeStr}`;
  }
  updateClock();
  setInterval(updateClock, 15000);

  // ---------- Toast ----------
  let toastTimer = null;
  function toast(message) {
    let el = document.getElementById("toastEl");
    if (!el) {
      el = document.createElement("div");
      el.id = "toastEl";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  // ---------- Content-type icon glyphs ----------
  // Thin monochrome line icons (~5-unit stroke on a 100x100 grid, rounded
  // caps/joins), matching a standard line-icon-pack look. They sit directly
  // on the existing frosted-glass tile, which acts as the icon's "frame".
  const LINE_ICON_STROKE = "rgba(255,255,255,0.94)";
  const LINE_ICON_ATTRS = `fill="none" stroke="${LINE_ICON_STROKE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;

  function typeIconSVG(type) {
    if (type === "magazine") return magazineIconSVG();
    if (type === "videos") return reelIconSVG();
    return folderIconSVG();
  }

  // Fallback glyph for folder types with no dedicated icon yet.
  function folderIconSVG() {
    return `
      <svg viewBox="0 0 100 100" class="type-icon-svg" aria-hidden="true">
        <path ${LINE_ICON_ATTRS}
              d="M14 32 C14 28.7 16.7 26 20 26 H40 L48 34 H80 C83.3 34 86 36.7 86 40 V70 C86 73.3 83.3 76 80 76 H20 C16.7 76 14 73.3 14 70 Z"/>
      </svg>`;
  }

  // Video-folder icon: a rounded play frame, matching a standard "media" glyph.
  function reelIconSVG() {
    return `
      <svg viewBox="0 0 100 100" class="type-icon-svg" aria-hidden="true">
        <rect ${LINE_ICON_ATTRS} x="12" y="24" width="76" height="52" rx="14"/>
        <path ${LINE_ICON_ATTRS} stroke-linejoin="round" d="M42 40 L62 50 L42 60 Z"/>
      </svg>`;
  }

  // Magazine-folder icon: an open book/spread with a spine.
  function magazineIconSVG() {
    return `
      <svg viewBox="0 0 100 100" class="type-icon-svg" aria-hidden="true">
        <path ${LINE_ICON_ATTRS} d="M50 30 C44 25 28 22 16 24 V68 C28 66 44 69 50 74 C56 69 72 66 84 68 V24 C72 22 56 25 50 30 Z"/>
        <path ${LINE_ICON_ATTRS} d="M50 30 V74"/>
      </svg>`;
  }

  // ---------- Render desktop icons (draggable, position remembered) ----------
  const ICON_POS_KEY = "desktopIconPositions";

  function loadIconPositions() {
    try {
      return JSON.parse(localStorage.getItem(ICON_POS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveIconPosition(id, xPct, yPct) {
    const positions = loadIconPositions();
    positions[id] = { x: xPct, y: yPct };
    try {
      localStorage.setItem(ICON_POS_KEY, JSON.stringify(positions));
    } catch (e) {
      /* storage unavailable, ignore */
    }
  }

  // Scattered "widget tile" layout, like icons placed by hand across a photo.
  // Kept clear of the top-left profile card.
  const SCATTER_SLOTS = [
    { x: 0.16, y: 0.46 },
    { x: 0.80, y: 0.19 },
    { x: 0.11, y: 0.70 },
    { x: 0.84, y: 0.52 },
    { x: 0.34, y: 0.78 },
    { x: 0.67, y: 0.76 },
    { x: 0.50, y: 0.34 },
    { x: 0.46, y: 0.64 }
  ];

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function defaultSlot(index, folderId) {
    const base = SCATTER_SLOTS[index % SCATTER_SLOTS.length];
    const h = hashString(folderId);
    const jitterX = ((h % 100) / 100 - 0.5) * 0.04;
    const jitterY = (((h >> 8) % 100) / 100 - 0.5) * 0.04;
    return { x: base.x + jitterX, y: base.y + jitterY };
  }

  function renderDesktopIcons() {
    iconField.innerHTML = "";
    const positions = loadIconPositions();

    FOLDERS.forEach((folder, index) => {
      const btn = document.createElement("button");
      btn.className = "desktop-icon";
      btn.type = "button";
      btn.dataset.folderId = folder.id;

      const hasCover = Boolean(folder.cover);
      const tileStyle = hasCover ? ` style="background-image:url('${folder.cover}')"` : "";
      btn.innerHTML = `
        <span class="icon-tile"${tileStyle}>
          ${hasCover ? "" : `<span class="icon-glyph icon-glyph--badge">${typeIconSVG(folder.type)}</span>`}
        </span>
        <span class="icon-label">${escapeHTML(folder.name)}</span>
      `;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (btn.dataset.suppressClick === "1") return;
        selectIcon(btn);
      });
      btn.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        openFolder(folder, btn);
      });
      attachDoubleTap(btn, () => openFolder(folder, btn));

      iconField.appendChild(btn);
      placeIcon(btn, positions[folder.id], index, folder.id);
      makeIconDraggable(btn, folder.id);
    });
  }

  function placeIcon(btn, saved, index, folderId) {
    const fieldRect = iconField.getBoundingClientRect();
    const slot = saved || defaultSlot(index, folderId);
    let left = slot.x * fieldRect.width;
    let top = slot.y * fieldRect.height;
    left = Math.max(8, Math.min(fieldRect.width - 104, left));
    top = Math.max(84, Math.min(fieldRect.height - 150, top));
    btn.style.left = `${left}px`;
    btn.style.top = `${top}px`;
  }

  function makeIconDraggable(btn, folderId) {
    let startX, startY, startLeft, startTop, moved;

    btn.addEventListener("pointerdown", (e) => {
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseFloat(btn.style.left);
      startTop = parseFloat(btn.style.top);
      btn.setPointerCapture(e.pointerId);
    });

    btn.addEventListener("pointermove", (e) => {
      if (startX === undefined) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      btn.classList.add("dragging");
      const fieldRect = iconField.getBoundingClientRect();
      const left = Math.max(8, Math.min(fieldRect.width - 100, startLeft + dx));
      const top = Math.max(40, Math.min(fieldRect.height - 150, startTop + dy));
      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
    });

    ["pointerup", "pointercancel"].forEach((evt) => {
      btn.addEventListener(evt, () => {
        if (moved) {
          btn.classList.remove("dragging");
          const fieldRect = iconField.getBoundingClientRect();
          const xPct = parseFloat(btn.style.left) / fieldRect.width;
          const yPct = parseFloat(btn.style.top) / fieldRect.height;
          saveIconPosition(folderId, xPct, yPct);
          btn.dataset.suppressClick = "1";
          setTimeout(() => {
            btn.dataset.suppressClick = "0";
          }, 50);
        }
        startX = undefined;
      });
    });
  }

  window.addEventListener("resize", () => {
    const positions = loadIconPositions();
    document.querySelectorAll(".desktop-icon").forEach((btn, i) => {
      const folderId = btn.dataset.folderId;
      placeIcon(btn, positions[folderId], i, folderId);
    });
  });

  function selectIcon(btn) {
    document.querySelectorAll(".desktop-icon.selected").forEach((el) => el.classList.remove("selected"));
    btn.classList.add("selected");
  }

  document.getElementById("desktop").addEventListener("click", () => {
    document.querySelectorAll(".desktop-icon.selected").forEach((el) => el.classList.remove("selected"));
  });

  function attachDoubleTap(el, cb) {
    let lastTap = 0;
    el.addEventListener("touchend", () => {
      const now = Date.now();
      if (now - lastTap < 350) cb();
      lastTap = now;
    });
  }

  function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // ---------- Folder open dispatch ----------
  function openFolder(folder, iconEl) {
    if (folder.type === "magazine") {
      openMagazine(folder, iconEl);
    } else {
      openVideoWindow(folder, iconEl);
    }
  }

  // ---------- Finder-style video window ----------
  function openVideoWindow(folder, iconEl) {
    if (openWindows[folder.id]) {
      bringToFront(openWindows[folder.id]);
      return;
    }

    const win = document.createElement("section");
    win.className = "os-window";
    win.dataset.folderId = folder.id;
    win.style.zIndex = String(++zCounter);

    const cascade = Object.keys(openWindows).length * 26;
    win.style.left = `calc(50% - 320px + ${cascade}px)`;
    win.style.top = `calc(50% - 220px + ${cascade}px)`;

    win.innerHTML = `
      <div class="titlebar">
        <div class="traffic-lights">
          <button class="tl tl-red" title="Close" aria-label="Close"></button>
          <button class="tl tl-yellow" title="Minimize" aria-label="Minimize"></button>
          <button class="tl tl-green" title="Zoom" aria-label="Zoom"></button>
        </div>
        <div class="titlebar-name">${escapeHTML(folder.name)}</div>
      </div>
      <div class="window-body">
        <div class="video-grid">
          ${folder.items.map((item, i) => videoTileHTML(item, i)).join("")}
        </div>
      </div>
    `;

    windowLayer.appendChild(win);
    openWindows[folder.id] = win;

    genieIn(win, iconEl);

    win.addEventListener("mousedown", () => bringToFront(win));

    win.querySelector(".tl-red").addEventListener("click", () => closeWindow(win, folder.id, iconEl));
    win.querySelector(".tl-yellow").addEventListener("click", () => minimizeWindow(win, folder.id));
    win.querySelector(".tl-green").addEventListener("click", () => toggleZoom(win));

    makeDraggable(win, win.querySelector(".titlebar"));

    win.querySelectorAll(".video-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        const idx = Number(tile.dataset.index);
        openLightbox(folder.items[idx]);
      });
    });
    attachTilt(win);

    activeAppName.textContent = folder.name;
  }

  function videoTileHTML(item, index) {
    const hasPoster = Boolean(item.poster);
    const posterStyle = hasPoster ? `style="background-image:url('${item.poster}')"` : "";
    return `
      <button class="video-tile ${hasPoster ? "" : "video-tile-placeholder"}" data-index="${index}" type="button">
        <span class="video-thumb" ${posterStyle}>
          <span class="play-triangle" aria-hidden="true"></span>
          ${hasPoster ? "" : `<span class="placeholder-hint">No poster — set in js/data.js</span>`}
          <span class="video-title-pill">${escapeHTML(item.title)}</span>
        </span>
      </button>
    `;
  }

  function attachTilt(container) {
    container.querySelectorAll(".video-tile").forEach((tile) => {
      const thumb = tile.querySelector(".video-thumb");
      tile.addEventListener("pointermove", (e) => {
        const r = tile.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        thumb.style.transform = `rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) scale(1.035)`;
      });
      tile.addEventListener("pointerleave", () => {
        thumb.style.transform = "";
      });
    });
  }

  function closeWindow(win, folderId, iconEl) {
    genieOut(win, iconEl, () => {
      win.remove();
      delete openWindows[folderId];
      activeAppName.textContent = IDLE_APP_NAME;
    });
  }

  function minimizeWindow(win, folderId) {
    const dockFinder = dock.querySelector('[data-dock="finder"]');
    const targetRect = dockFinder.getBoundingClientRect();
    const rect = win.getBoundingClientRect();
    animateTo(win, rect, targetRect, () => {
      win.style.visibility = "hidden";
      win.style.pointerEvents = "none";
    });
    minimizedStack.push({ id: folderId, el: win });
  }

  function bounceDockIcon(kind) {
    const el = dock.querySelector(`[data-dock="${kind}"]`);
    if (!el) return;
    el.classList.remove("bounce");
    void el.offsetWidth;
    el.classList.add("bounce");
  }

  function restoreMinimized() {
    if (!minimizedStack.length) {
      bounceDockIcon("finder");
      return;
    }
    const entry = minimizedStack.pop();
    const win = entry.el;
    win.style.visibility = "visible";
    win.style.pointerEvents = "auto";
    const dockFinder = dock.querySelector('[data-dock="finder"]');
    const fromRect = dockFinder.getBoundingClientRect();
    win.style.transform = "translate(0,0) scale(1)";
    win.style.opacity = "1";
    const homeRect = win.getBoundingClientRect();
    animateFrom(win, fromRect, homeRect);
    bringToFront(win);
  }

  function toggleZoom(win) {
    win.classList.toggle("zoomed");
  }

  function bringToFront(win) {
    win.style.zIndex = String(++zCounter);
  }

  // ---------- Genie animation helpers ----------
  function genieIn(win, iconEl) {
    const originRect = iconEl ? iconEl.getBoundingClientRect() : centerRect();
    win.style.opacity = "0";
    requestAnimationFrame(() => {
      const wRect = win.getBoundingClientRect();
      const dx = originRect.left + originRect.width / 2 - (wRect.left + wRect.width / 2);
      const dy = originRect.top + originRect.height / 2 - (wRect.top + wRect.height / 2);
      win.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
      win.style.opacity = "0";
      requestAnimationFrame(() => {
        win.style.transition = "transform .38s cubic-bezier(.2,.9,.25,1), opacity .28s ease";
        win.style.transform = "translate(0,0) scale(1)";
        win.style.opacity = "1";
      });
    });
  }

  function genieOut(win, iconEl, done) {
    const originRect = iconEl ? iconEl.getBoundingClientRect() : centerRect();
    const wRect = win.getBoundingClientRect();
    const dx = originRect.left + originRect.width / 2 - (wRect.left + wRect.width / 2);
    const dy = originRect.top + originRect.height / 2 - (wRect.top + wRect.height / 2);
    win.style.transition = "transform .3s cubic-bezier(.4,0,.6,1), opacity .26s ease";
    win.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
    win.style.opacity = "0";
    setTimeout(done, 300);
  }

  function animateTo(el, fromRect, toRect, done) {
    const scaleX = 60 / fromRect.width;
    const scaleY = 44 / fromRect.height;
    el.style.transformOrigin = "top left";
    el.style.transition = "transform .32s cubic-bezier(.4,0,.6,1), opacity .28s ease";
    const dx = toRect.left - fromRect.left;
    const dy = toRect.top - fromRect.top;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    el.style.opacity = "0";
    setTimeout(done, 320);
  }

  function animateFrom(el, fromRect, toRect) {
    const scaleX = 60 / toRect.width;
    const scaleY = 44 / toRect.height;
    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    el.style.transformOrigin = "top left";
    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    el.style.opacity = "0";
    requestAnimationFrame(() => {
      el.style.transition = "transform .34s cubic-bezier(.2,.9,.25,1), opacity .3s ease";
      el.style.transform = "translate(0,0) scale(1)";
      el.style.opacity = "1";
    });
  }

  function centerRect() {
    return { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  }

  // ---------- Dragging ----------
  function makeDraggable(win, handle) {
    let dragging = false;
    let startX, startY, startLeft, startTop;

    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".tl")) return;
      dragging = true;
      bringToFront(win);
      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      win.style.transition = "none";
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const nx = startLeft + (e.clientX - startX);
      const ny = Math.max(28, startTop + (e.clientY - startY));
      win.style.left = `${nx}px`;
      win.style.top = `${ny}px`;
    });

    ["pointerup", "pointercancel"].forEach((evt) => {
      handle.addEventListener(evt, () => {
        dragging = false;
      });
    });
  }

  // ---------- Video lightbox ----------
  function openLightbox(item) {
    lightboxTitle.textContent = item.title;
    lightboxVideo.src = item.src;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("show"));
    lightboxVideo.play().catch(() => {});

    lightboxVideo.onerror = () => {
      lightboxTitle.textContent = `${item.title} — video file not found`;
    };
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    setTimeout(() => {
      lightbox.hidden = true;
    }, 200);
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ---------- Magazine viewer ----------
  let magazinePages = [];
  let magazineIndex = 0;
  let magazineIconEl = null;

  function openMagazine(folder, iconEl) {
    magazineIconEl = iconEl;
    magazinePages = folder.pages || [];
    magazineIndex = 0;

    magazineStage.innerHTML = `<div class="magazine-track">${magazinePages
      .map((p) => magazinePageHTML(p))
      .join("")}</div>`;

    magazineDots.innerHTML = magazinePages
      .map((_, i) => `<button class="mdot ${i === 0 ? "active" : ""}" data-i="${i}" aria-label="Page ${i + 1}"></button>`)
      .join("");

    magazineOverlay.hidden = false;
    requestAnimationFrame(() => magazineOverlay.classList.add("show"));

    updateMagazinePosition(false);
    activeAppName.textContent = folder.name || "Magazine";

    magazineDots.querySelectorAll(".mdot").forEach((dot) => {
      dot.addEventListener("click", () => goToPage(Number(dot.dataset.i)));
    });

    attachMagazineSwipe();
  }

  function magazinePageHTML(page) {
    const bgStyle = page.image ? `style="background-image:url('${page.image}')"` : "";
    if (page.kind === "cover") {
      return `
        <article class="magazine-page magazine-cover ${page.image ? "" : "no-image"}" ${bgStyle}>
          <div class="cover-inner">
            <h1>${escapeHTML(page.title || "")}</h1>
            <p>${escapeHTML(page.subtitle || "")}</p>
          </div>
          ${page.image ? "" : `<span class="placeholder-hint center-hint">Set a cover image in js/data.js</span>`}
        </article>`;
    }
    return `
      <article class="magazine-page magazine-spread">
        <div class="spread-image ${page.image ? "" : "no-image"}" ${bgStyle}>
          ${page.image ? "" : `<span class="placeholder-hint">Add an image path in js/data.js</span>`}
        </div>
        <div class="spread-text">
          <h2>${escapeHTML(page.heading || "")}</h2>
          <p>${escapeHTML(page.body || "")}</p>
        </div>
      </article>`;
  }

  function updateMagazinePosition(animate) {
    const track = magazineStage.querySelector(".magazine-track");
    if (!track) return;
    track.style.transition = animate ? "transform .45s cubic-bezier(.2,.9,.25,1)" : "none";
    track.style.transform = `translateX(-${magazineIndex * 100}%)`;

    magazineDots.querySelectorAll(".mdot").forEach((dot, i) => {
      dot.classList.toggle("active", i === magazineIndex);
    });
    magazinePrev.disabled = magazineIndex === 0;
    magazineNext.disabled = magazineIndex === magazinePages.length - 1;
  }

  function goToPage(i) {
    magazineIndex = Math.max(0, Math.min(magazinePages.length - 1, i));
    updateMagazinePosition(true);
  }

  magazinePrev.addEventListener("click", () => goToPage(magazineIndex - 1));
  magazineNext.addEventListener("click", () => goToPage(magazineIndex + 1));

  function closeMagazine() {
    magazineOverlay.classList.remove("show");
    setTimeout(() => {
      magazineOverlay.hidden = true;
      magazineStage.innerHTML = "";
      activeAppName.textContent = IDLE_APP_NAME;
    }, 220);
  }
  magazineClose.addEventListener("click", closeMagazine);

  function attachMagazineSwipe() {
    const stage = magazineStage;
    let startX = 0;
    let dx = 0;
    let dragging = false;

    stage.onpointerdown = (e) => {
      dragging = true;
      startX = e.clientX;
      dx = 0;
      const track = stage.querySelector(".magazine-track");
      if (track) track.style.transition = "none";
    };
    stage.onpointermove = (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      const track = stage.querySelector(".magazine-track");
      if (track) track.style.transform = `translateX(calc(-${magazineIndex * 100}% + ${dx}px))`;
    };
    stage.onpointerup = () => {
      dragging = false;
      if (dx < -60) goToPage(magazineIndex + 1);
      else if (dx > 60) goToPage(magazineIndex - 1);
      else updateMagazinePosition(true);
    };
  }

  // ---------- Global keyboard ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!lightbox.hidden) closeLightbox();
      else if (!magazineOverlay.hidden) closeMagazine();
      else {
        const top = topWindow();
        if (top) closeWindow(top, top.dataset.folderId, null);
      }
    }
    if (!magazineOverlay.hidden) {
      if (e.key === "ArrowRight") goToPage(magazineIndex + 1);
      if (e.key === "ArrowLeft") goToPage(magazineIndex - 1);
    }
  });

  function topWindow() {
    const wins = Array.from(windowLayer.querySelectorAll(".os-window"));
    if (!wins.length) return null;
    return wins.reduce((a, b) => (Number(a.style.zIndex) > Number(b.style.zIndex) ? a : b));
  }

  // ---------- Dock: build from Finder + Mail + SOCIAL_LINKS ----------
  const SOCIAL_ICON_META = {
    instagram: { slug: "instagram", bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" },
    x: { slug: "x", bg: "#000000" },
    behance: { slug: "behance", bg: "#1769ff" },
    linkedin: { slug: "linkedin", bg: "#0a66c2" },
    github: { slug: "github", bg: "#171515" },
    dribbble: { slug: "dribbble", bg: "#ea4c89" },
    youtube: { slug: "youtube", bg: "#ff0000" },
    tiktok: { slug: "tiktok", bg: "#000000" },
    vimeo: { slug: "vimeo", bg: "#1ab7ea" },
    threads: { slug: "threads", bg: "#000000" }
  };

  function finderSVG() {
    return `
      <svg viewBox="0 0 100 100" class="dock-icon-svg" aria-hidden="true">
        <defs>
          <linearGradient id="dockFinderGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#5ac8fa"/>
            <stop offset="1" stop-color="#0a84ff"/>
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#dockFinderGrad)"/>
        <path d="M50 20 A30 30 0 0 1 50 80 Z" fill="#ffffff" opacity="0.92"/>
        <circle cx="38" cy="46" r="4.5" fill="#0a1f33"/>
        <path d="M30 62 Q50 50 70 62" stroke="#0a1f33" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      </svg>`;
  }

  function mailSVG() {
    return `
      <svg viewBox="0 0 100 100" class="dock-icon-svg" aria-hidden="true">
        <defs>
          <linearGradient id="dockMailGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#8e9aa8"/>
            <stop offset="1" stop-color="#3a4451"/>
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="88" height="88" rx="22" fill="url(#dockMailGrad)"/>
        <rect x="24" y="34" width="52" height="34" rx="4" fill="#ffffff"/>
        <path d="M24 36 L50 56 L76 36" stroke="#3a4451" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  function buildDock() {
    dock.innerHTML = "";

    const finder = document.createElement("button");
    finder.type = "button";
    finder.className = "dock-item";
    finder.dataset.dock = "finder";
    finder.title = "Finder";
    finder.innerHTML = `${finderSVG()}<span class="dock-dot" aria-hidden="true"></span>`;
    finder.addEventListener("click", () => restoreMinimized());
    dock.appendChild(finder);

    const mail = document.createElement("button");
    mail.type = "button";
    mail.className = "dock-item";
    mail.dataset.dock = "mail";
    mail.title = "Contact";
    mail.innerHTML = mailSVG();
    mail.addEventListener("click", () => {
      if (typeof CONTACT_EMAIL === "string" && CONTACT_EMAIL) {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
      } else {
        toast("Add your email to CONTACT_EMAIL in js/data.js");
      }
    });
    dock.appendChild(mail);

    (typeof SOCIAL_LINKS !== "undefined" ? SOCIAL_LINKS : []).forEach((link) => {
      const meta = SOCIAL_ICON_META[link.type];
      if (!meta || !link.url) return;
      const a = document.createElement("a");
      a.className = "dock-item";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = link.type;
      a.innerHTML = `
        <span class="dock-icon-tile" style="background:${meta.bg}">
          <img src="https://cdn.simpleicons.org/${meta.slug}/ffffff" alt="${link.type}" loading="lazy">
        </span>`;
      dock.appendChild(a);
    });

    dockItems = Array.from(dock.querySelectorAll(".dock-item"));
  }

  // ---------- Dock magnification ----------
  let dockItems = [];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    dock.addEventListener("pointermove", (e) => {
      dockItems.forEach((item) => {
        const r = item.getBoundingClientRect();
        const centerX = r.left + r.width / 2;
        const dist = Math.abs(e.clientX - centerX);
        const sigma = 68;
        const scale = 1 + 0.55 * Math.exp(-(dist * dist) / (2 * sigma * sigma));
        item.style.transform = `translateY(${(-(scale - 1) * 22).toFixed(1)}px) scale(${scale.toFixed(3)})`;
      });
    });
    dock.addEventListener("pointerleave", () => {
      dockItems.forEach((item) => {
        item.style.transform = "";
      });
    });
  }

  // ---------- Wallpaper ----------
  function applyWallpaper() {
    if (typeof WALLPAPER === "string" && WALLPAPER) {
      const photoEl = document.getElementById("desktopPhoto");
      photoEl.style.backgroundImage = `url('${WALLPAPER}')`;
      photoEl.hidden = false;
    }
  }

  // ---------- Menu bar nav (real shortcuts to each folder) ----------
  function renderMenubarItems() {
    menubarItems.innerHTML = "";
    FOLDERS.forEach((folder) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "menubar-item";
      item.textContent = folder.name;
      item.addEventListener("click", () => {
        const iconEl = iconField.querySelector(`[data-folder-id="${folder.id}"]`);
        openFolder(folder, iconEl);
      });
      menubarItems.appendChild(item);
    });
  }

  // ---------- Profile card ----------
  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  function renderProfileCard() {
    if (typeof PROFILE !== "object" || !PROFILE || !profileCard) return;

    const hasAvatar = Boolean(PROFILE.avatar);
    const avatarStyle = hasAvatar
      ? ` style="background-image:url('${PROFILE.avatar}')"`
      : ` style="background:linear-gradient(135deg,#6fd3ff,var(--accent))"`;

    let statusHTML = "";
    if (PROFILE.available !== null && PROFILE.available !== undefined) {
      const label = PROFILE.available ? "Available for work" : "Not available";
      statusHTML = `
        <div class="profile-status${PROFILE.available ? "" : " is-unavailable"}">
          <span class="profile-status-dot" aria-hidden="true"></span>
          <span>${escapeHTML(label)}</span>
        </div>`;
    }

    profileCard.innerHTML = `
      <span class="profile-avatar"${avatarStyle}>${hasAvatar ? "" : escapeHTML(initials(PROFILE.name || "?"))}</span>
      <span class="profile-text">
        <span class="profile-name">${escapeHTML(PROFILE.name || "")}</span>
        <span class="profile-role">${escapeHTML(PROFILE.role || "")}</span>
        <span class="profile-bio">${escapeHTML(PROFILE.bio || "")}</span>
        ${statusHTML}
      </span>
    `;
  }

  // ---------- Init ----------
  activeAppName.textContent = IDLE_APP_NAME;
  applyWallpaper();
  renderDesktopIcons();
  renderMenubarItems();
  renderProfileCard();
  buildDock();
})();
