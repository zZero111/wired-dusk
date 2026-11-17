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

const POOL_LEFT = 'M-40 1000 C 20 900 180 860 330 880 C 420 892 440 950 400 1000 Z'
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
  .cur { animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  text { font-family: "Courier New", monospace; font-size: 15px; fill: #8a63c4; letter-spacing: 2px; }
  @media (max-aspect-ratio: 3/4) { .side { display: none; } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="sun" cx="1230" cy="790" r="420" fill="url(#glow)"/>
<path d="M0 1000 V872 h90 v-30 h70 v18 h120 v-46 h60 v40 h140 v-24 h90 v52 h110 v-36 h80 v20 h150 v-58 h40 v30 h130 v-22 h120 v40 h100 v-60 h70 v44 h140 v-28 h90 V1000 Z" fill="#09061a"/>
${pool(POOL_LEFT, '')}
${pool(POOL_RIGHT, ' b')}
${WIRES.map(wire).join('\n')}
<g class="side">${pole(160)}${pole(1440)}</g>
<text x="1580" y="40" text-anchor="end">serial experiments lain <tspan class="cur">&#9608;</tspan></text>
<rect width="1600" height="1000" fill="url(#scan)" opacity=".28"/>
<rect class="roll" width="1600" height="200" fill="url(#bar)"/>
</svg>`
