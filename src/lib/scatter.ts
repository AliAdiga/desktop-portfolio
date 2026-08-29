// Organic scatter positions (percentage of the desktop area), like icons
// placed by hand across a photo. Deterministic per id so layout is stable
// across reloads, with a small hash-based jitter so items don't line up
// in a perfect grid.
const SCATTER_SLOTS = [
  { x: 0.08, y: 0.14 },
  { x: 0.26, y: 0.08 },
  { x: 0.46, y: 0.13 },
  { x: 0.10, y: 0.42 },
  { x: 0.30, y: 0.52 },
  { x: 0.50, y: 0.40 },
  { x: 0.12, y: 0.70 },
  { x: 0.32, y: 0.76 },
  { x: 0.52, y: 0.68 },
  { x: 0.20, y: 0.30 },
  { x: 0.42, y: 0.26 },
  { x: 0.22, y: 0.58 },
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  return h;
}

export function scatterPosition(index: number, id: string): { xPct: number; yPct: number } {
  const base = SCATTER_SLOTS[index % SCATTER_SLOTS.length];
  const h = hashString(id);
  const jitterX = ((h % 100) / 100 - 0.5) * 0.035;
  const jitterY = (((h >> 8) % 100) / 100 - 0.5) * 0.035;
  return { xPct: base.x + jitterX, yPct: base.y + jitterY };
}
