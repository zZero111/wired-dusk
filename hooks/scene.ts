// Violet dusk over rooftops: power lines humming with signal, CRT scanlines and
// a rolling refresh bar, dotted shadows pooling in the lower corners.
const WIRES = [
  'M0 70 Q800 300 1600 70',
  'M0 112 Q800 330 1600 112',
  'M0 150 Q800 360 1600 150',
  'M0 205 Q800 400 1600 205',
  'M0 240 Q800 420 1600 240',
  'M160 112 L0 20',
  'M1440 112 L1600 30',
  'M160 205 L0 300',
  'M1440 205 L1600 320',
]

const wire = (d: string, i: number): string =>
  `<path d="${d}" class="w"/><path d="${d}" class="hum" style="animation-delay:-${(i * 1.7).toFixed(1)}s"/>`

const pole = (x: number): string => `
  <rect x="${x - 7}" y="30" width="14" height="980" fill="#07050e"/>
  <rect x="${x - 110}" y="104" width="220" height="10" fill="#07050e"/>
  <rect x="${x - 90}" y="197" width="180" height="9" fill="#07050e"/>
  ${[-100, -60, 60, 100].map(o => `<rect x="${x + o - 3}" y="92" width="6" height="14" rx="2" fill="#0d0a18"/>`).join('')}
  ${[-80, -45, 45, 80].map(o => `<rect x="${x + o - 3}" y="186" width="6" height="12" rx="2" fill="#0d0a18"/>`).join('')}
  <rect x="${x + 10}" y="260" width="34" height="46" rx="4" fill="#07050e"/>`

// A small fixed-seed generator, so the skyline is the same on every load.
const rng = (seed: number) => (): number => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

const n = (v: number): string => v.toFixed(0)

// Two rows of buildings: a pale far row for depth, and a near row of
// apartment blocks, houses, a water tower and offices with lit windows.
const skyline = (): string => {
  const next = rng(1998)
  const out: string[] = []

  // Far row: taller, hazier blocks with a few lit windows.
  for (let x = -20; x < 1620; ) {
    const w = 60 + next() * 110
    const top = 760 + next() * 90
    out.push(`<rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(1000 - top)}" class="far"/>`)
    for (let k = 0; k < 4; k++) {
      if (next() < 0.5) {
        out.push(`<rect x="${n(x + 8 + next() * (w - 20))}" y="${n(top + 12 + next() * 80)}" width="5" height="7" class="win-far"/>`)
      }
    }
    if (next() < 0.35) out.push(`<path d="M${n(x + w * 0.7)} ${n(top)} v-${n(18 + next() * 26)}" class="antenna"/>`)
    x += w + next() * 6
  }

  // Near row.
  const windows = (x: number, top: number, w: number, h: number, cols: number, rows: number): void => {
    const gx = (w - 16) / cols
    const gy = Math.min(22, (h - 18) / rows)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const roll = next()
        const cls = roll < 0.05 ? 'win-bright' : roll < 0.24 ? 'win-lit' : 'win'
        out.push(`<rect x="${n(x + 10 + c * gx)}" y="${n(top + 14 + r * gy)}" width="${n(Math.max(5, gx - 7))}" height="9" class="${cls}"/>`)
      }
    }
  }

  for (let x = -10; x < 1610; ) {
    const roll = next()
    if (roll < 0.45) {
      // Apartment block: rows of windows, balcony rails, a stairwell box on top.
      const w = 110 + next() * 90
      const top = 830 + next() * 50
      out.push(`<rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(1000 - top)}" class="near"/>`)
      out.push(`<path d="M${n(x)} ${n(top)} h${n(w)}" class="rim"/>`)
      windows(x, top, w, 1000 - top, Math.floor(w / 26), Math.floor((1000 - top) / 24))
      for (let y = top + 30; y < 990; y += 24) out.push(`<path d="M${n(x + 4)} ${n(y)} h${n(w - 8)}" class="rail"/>`)
      out.push(`<rect x="${n(x + w * 0.62)}" y="${n(top - 22)}" width="34" height="22" class="near"/>`)
      if (next() < 0.6) out.push(`<rect x="${n(x + 10)}" y="${n(top - 10)}" width="18" height="10" class="near"/><rect x="${n(x + 34)}" y="${n(top - 10)}" width="18" height="10" class="near"/>`)
      x += w + 4 + next() * 10
    } else if (roll < 0.65) {
      // House: a pitched roof over a low wall.
      const w = 80 + next() * 40
      const top = 925 + next() * 20
      const peak = top - 34 - next() * 14
      out.push(`<path d="M${n(x - 6)} ${n(top)} L${n(x + w / 2)} ${n(peak)} L${n(x + w + 6)} ${n(top)} Z" class="near"/>`)
      out.push(`<path d="M${n(x - 6)} ${n(top)} L${n(x + w / 2)} ${n(peak)} L${n(x + w + 6)} ${n(top)}" class="rim"/>`)
      out.push(`<rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(1000 - top)}" class="near"/>`)
      out.push(`<rect x="${n(x + w * 0.25)}" y="${n(top + 14)}" width="14" height="12" class="${next() < 0.5 ? 'win-lit' : 'win'}"/>`)
      out.push(`<rect x="${n(x + w * 0.6)}" y="${n(top + 14)}" width="14" height="12" class="${next() < 0.3 ? 'win-bright' : 'win'}"/>`)
      x += w + 14 + next() * 12
    } else if (roll < 0.8) {
      // Water tower on legs above a squat building.
      const w = 90 + next() * 40
      const top = 880 + next() * 30
      const tx = x + w * 0.3
      out.push(`<rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(1000 - top)}" class="near"/>`)
      out.push(`<path d="M${n(x)} ${n(top)} h${n(w)}" class="rim"/>`)
      windows(x, top, w, 1000 - top, Math.floor(w / 30), 3)
      out.push(`<path d="M${n(tx + 4)} ${n(top)} L${n(tx + 8)} ${n(top - 40)} M${n(tx + 40)} ${n(top)} L${n(tx + 36)} ${n(top - 40)} M${n(tx + 6)} ${n(top - 14)} L${n(tx + 38)} ${n(top - 30)} M${n(tx + 6)} ${n(top - 30)} L${n(tx + 38)} ${n(top - 14)}" class="strut"/>`)
      out.push(`<rect x="${n(tx)}" y="${n(top - 76)}" width="44" height="38" rx="4" class="near"/>`)
      out.push(`<path d="M${n(tx - 2)} ${n(top - 76)} Q${n(tx + 22)} ${n(top - 92)} ${n(tx + 46)} ${n(top - 76)} Z" class="near"/>`)
      x += w + 6 + next() * 10
    } else {
      // Office: a taller block with a lit strip, rooftop units and a mast.
      const w = 70 + next() * 50
      const top = 800 + next() * 40
      out.push(`<rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(1000 - top)}" class="near"/>`)
      out.push(`<path d="M${n(x)} ${n(top)} h${n(w)}" class="rim"/>`)
      windows(x, top, w, 1000 - top, Math.floor(w / 22), Math.floor((1000 - top) / 22))
      out.push(`<rect x="${n(x + 8)}" y="${n(top - 12)}" width="22" height="12" class="near"/><rect x="${n(x + w - 30)}" y="${n(top - 8)}" width="16" height="8" class="near"/>`)
      out.push(`<path d="M${n(x + w / 2)} ${n(top)} v-46 M${n(x + w / 2 - 8)} ${n(top - 30)} h16" class="antenna"/>`)
      out.push(`<circle cx="${n(x + w / 2)}" cy="${n(top - 47)}" r="2.5" class="beacon"/>`)
      x += w + 6 + next() * 10
    }
  }

  return out.join('')
}

const POOL_LEFT ='M-40 1000 C 20 900 180 860 330 880 C 420 892 440 950 400 1000 Z'
const POOL_RIGHT = 'M1640 1000 C 1590 905 1440 870 1300 890 C 1210 905 1190 960 1230 1000 Z'

const pool = (d: string, extra: string): string =>
  `<g class="pool${extra}"><path d="${d}" fill="#07040f" opacity=".6"/><path d="${d}" fill="url(#dots)"/></g>`

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#0d0918"/>
    <stop offset="0.45" stop-color="#1f1236"/>
    <stop offset="0.78" stop-color="#3a1d5e"/>
    <stop offset="1" stop-color="#1a0e2e"/>
  </linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#b98aff" stop-opacity="0.38"/>
    <stop offset="0.35" stop-color="#7b3fd6" stop-opacity="0.22"/>
    <stop offset="1" stop-color="#7b3fd6" stop-opacity="0"/>
  </radialGradient>
  <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
    <circle cx="8" cy="8" r="3.4" fill="#8a2fc0"/>
  </pattern>
  <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="1.4" fill="#000"/>
  </pattern>
  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.5" stop-color="#ddc8ff" stop-opacity="0.05"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
</defs>
<style>
  .w { fill: none; stroke: #05030c; stroke-width: 2.4; }
  .hum { fill: none; stroke: #b98aff; stroke-width: 1.6; stroke-dasharray: 4 46; opacity: .6; animation: flow 7s linear infinite; }
  @keyframes flow { to { stroke-dashoffset: -500; } }
  .pool { transform-box: fill-box; transform-origin: center; animation: breathe 9s ease-in-out infinite; }
  .pool.b { animation-delay: -4.5s; }
  @keyframes breathe { 0%,100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.05); opacity: .72; } }
  .sun { animation: pulse 11s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: .7; } }
  .roll { animation: roll 8s linear infinite; }
  @keyframes roll { from { transform: translateY(-220px); } to { transform: translateY(1100px); } }
  .far { fill: #170d2b; }
  .near { fill: #09061a; }
  .rim { fill: none; stroke: #3b2366; stroke-width: 1.2; }
  .rail { fill: none; stroke: #140c26; stroke-width: 1.4; }
  .strut, .antenna { fill: none; stroke: #09061a; stroke-width: 2.4; }
  .antenna { stroke: #0e0920; }
  .win { fill: #130c24; }
  .win-far { fill: #3d2c6e; opacity: .55; }
  .win-lit { fill: #4a3690; opacity: .85; }
  .win-bright { fill: #c9a6ff; opacity: .75; }
  .beacon { fill: #b98aff; animation: pulse 3s ease-in-out infinite; }
  .cur { animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  text { font-family: "Courier New", monospace; font-size: 15px; fill: #8a63c4; letter-spacing: 2px; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="sun" cx="1230" cy="790" r="420" fill="url(#glow)"/>
<g class="skyline">${skyline()}</g>
${pool(POOL_LEFT, '')}
${pool(POOL_RIGHT, ' b')}
${WIRES.map(wire).join('\n')}
<g class="side">${pole(160)}${pole(1440)}</g>
<text x="1580" y="40" text-anchor="end">serial experiments lain <tspan class="cur">&#9608;</tspan></text>
<rect width="1600" height="1000" fill="url(#scan)" opacity=".28"/>
<rect class="roll" width="1600" height="200" fill="url(#bar)"/>
</svg>`
