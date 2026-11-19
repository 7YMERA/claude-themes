// A soft meadow behind the chat, with a little pixel-art Claude critter and its laptop in the bottom-right corner.
// One SVG serves both modes: colours are classes, and a prefers-color-scheme rule swaps them for the night palette.
// The ground fills any window (slice); the critter sits in its own nested svg pinned to the bottom-right (meet),
// so it stays in view on any window shape, clear of the words in the middle.

const DAY = {
  s0: '#e6d9f0', s1: '#f8d9c6', s2: '#fcefe3',
  sun: '#f7b98e', halo: '#fbd6b8',
  cloud: '#fffaf4',
  far: '#dcd5c4', mid: '#bcc7a5', near: '#97ae84', front: '#83a072', tuft: '#6d8c5d',
  body: '#d97757', shade: '#b65d40', hi: '#ea9572', eye: '#2b1d18', blush: '#f2a08a',
  lapF: '#4b4352', lapS: '#fbf5ec', code1: '#d97757', code2: '#8fa77f', code3: '#b49ad0', glow: '#fbf5ec',
  dot: '#ffffff',
}
const NIGHT = {
  s0: '#100d24', s1: '#2a1d47', s2: '#50304f',
  sun: '#f6ead3', halo: '#3b2c5c',
  cloud: '#3a2c5a',
  far: '#2f2649', mid: '#251f3e', near: '#1c1832', front: '#17142b', tuft: '#241f3d',
  body: '#d97757', shade: '#a9533a', hi: '#e8916d', eye: '#1a1210', blush: '#e48a74',
  lapF: '#2e2838', lapS: '#ffe6c2', code1: '#d97757', code2: '#9cc48a', code3: '#c7b0ea', glow: '#ffd9a0',
  dot: '#ffd98a',
}

// the critter, my own pixel drawing: O body, S shade, H highlight, E eye, P blush
const CRITTER = [
  '..HHHHHHHHHO..',
  '..HOOOOOOOOS..',
  '..OOEOOOOEOS..',
  'OOOOEOOOOEOSSS',
  'OOOPOOOOOOPSSS',
  '..OOOOOOOOOS..',
  '..SSSSSSSSSS..',
]
const LEGS = [
  '..O.O....O.O..',
  '..S.S....S.S..',
]
// the laptop: F frame, W screen, 1-3 code lines, C cursor, B base
const LAPTOP = [
  '.FFFFFFFFFF.',
  '.FWWWWWWWWF.',
  '.FW111W22WF.',
  '.FWW333WWWF.',
  '.FWW22W1CWF.',
  '.FWWWWWWWWF.',
  '.FFFFFFFFFF.',
  'BBBBBBBBBBBB',
]
const KEY = { O: 'body', S: 'shade', H: 'hi', E: 'eye', P: 'blush', F: 'lapF', W: 'lapS', '1': 'code1', '2': 'code2', '3': 'code3', B: 'lapF' }

function pixels(rows, ox, oy, size, only) {
  const byClass = {}
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const k = KEY[ch]
    if (!k || (only && !only.includes(ch))) return
    ;(byClass[k] ||= []).push(`M${ox + x * size} ${oy + y * size}h${size}v${size}h-${size}z`)
  }))
  return Object.entries(byClass).map(([k, d]) => `<path class="${k}" d="${d.join('')}"/>`).join('')
}

// goofy friends, drawn with inline colours (the same by day and night)
const INK = { E: '#2b1d18', P: '#f2a08a', W: '#ffffff', T: '#e8657a', K: '#1d1820', Y: '#ffd35c', R: '#e8657a', G: '#7fc8f0', Z: '#ffe9b8' }
const COATS = {
  lilac: { O: '#b9a3e3', S: '#9580c4', H: '#d2c2f2' },
  mint: { O: '#8fcfb0', S: '#68ac8c', H: '#b2e3c9' },
  peach: { O: '#f2b38f', S: '#d58f69', H: '#f9cdb0' },
  orange: { O: '#d97757', S: '#b65d40', H: '#ea9572' },
}
const DERP = [ // googly eyes and a tongue out
  '..HHHHHHHHHO..',
  '..HOOOOOOOOS..',
  '..OEOOOOWEOS..',
  'OOOEOOOOEEOSSS',
  'OOOOOOOOOOOSSS',
  '..OOOOTTOOOS..',
  '..SSSSTTSSSS..',
  '..O.O.TT.O.O..',
  '..S.S....S.S..',
]
const SHADES = [ // too cool, with a smirk
  '..HHHHHHHHHO..',
  '..HOOOOOOOOS..',
  '..KKKKOKKKKS..',
  'OOOKKOOOKKOSSS',
  'OOOOOOOOOOOSSS',
  '..OOOOOOEEOS..',
  '..SSSSSSSSSS..',
  '..O.O....O.O..',
  '..S.S....S.S..',
]
const SLEEPY = [
  '..HHHHHHHHHO..',
  '..HOOOOOOOOS..',
  '..OOOOOOOOOS..',
  'OOOEEOOOEEOSSS',
  'OOPOOOOOOPOSSS',
  '..OOOOOOOOOS..',
  '..SSSSSSSSSS..',
  '..O.O....O.O..',
  '..S.S....S.S..',
]
const PLAIN = [
  '..HHHHHHHHHO..',
  '..HOOOOOOOOS..',
  '..OOEOOOOEOS..',
  'OOOOEOOOOEOSSS',
  'OOOPOOOOOOPSSS',
  '..OOOOOOOOOS..',
  '..SSSSSSSSSS..',
  '..O.O....O.O..',
  '..S.S....S.S..',
]
const PEEKER = [ // side-eye
  '..HHHHHHHHHO..',
  '..HOOOOOOOOS..',
  '..EOOOOEOOOS..',
  'OOEOOOOEOOOSSS',
  'OOOOOOOOOOOSSS',
  '..OOOOOOOOOS..',
  '..SSSSSSSSSS..',
]
const HAT = [
  '......Y.......',
  '......R.......',
  '.....RGR......',
  '.....RRR......',
  '....RGRGR.....',
]
const ZED = ['ZZZZZ', '...Z.', '..Z..', '.Z...', 'ZZZZZ']

function sprite(rows, ox, oy, size, coat = {}) {
  const map = { ...INK, ...coat }, byFill = {}
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const f = map[ch]
    if (!f) return
    ;(byFill[f] ||= []).push(`M${ox + x * size} ${oy + y * size}h${size}v${size}h-${size}z`)
  }))
  return Object.entries(byFill).map(([f, d]) => `<path fill="${f}" d="${d.join('')}"/>`).join('')
}

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }

function css() {
  const rules = p => Object.entries(p).map(([k, v]) => k.startsWith('s') && k.length === 2
    || k === 'glow' ? `.${k}{stop-color:${v}}` : `.${k}{fill:${v}}`).join('')
  return `
${rules(DAY)}
.night{opacity:0}
.day{opacity:1}
@media (prefers-color-scheme: dark){${rules(NIGHT)}.night{opacity:1}.day{opacity:0}}
.drift{animation:drift 140s linear infinite}
.drift2{animation:drift 200s linear infinite}
.tw{animation:tw 5s ease-in-out infinite}
.tw1{animation-delay:1.7s}
.tw2{animation-delay:3.3s}
.bob{animation:bob 4s ease-in-out infinite}
.blink{transform-box:fill-box;transform-origin:center;animation:blink 7s infinite}
.cur{animation:cur 1.2s steps(1) infinite}
.fly{animation:fly 9s ease-in-out infinite}
.fly1{animation-delay:3s;animation-duration:11s}
.fly2{animation-delay:6s;animation-duration:13s}
.sway{transform-box:fill-box;transform-origin:bottom center;animation:sway 6s ease-in-out infinite}
.hop{animation:hop 2.4s ease-in-out infinite}
.squish{transform-box:fill-box;transform-origin:bottom center;animation:squish 2.4s ease-in-out infinite}
.wobble{transform-box:fill-box;transform-origin:bottom center;animation:wobble 3.2s ease-in-out infinite}
.peek{animation:peek 9s ease-in-out infinite}
.zz{animation:zz 4.5s linear infinite;opacity:0}
.zz1{animation-delay:1.5s}
.zz2{animation-delay:3s}
.flap{transform-box:fill-box;transform-origin:center;animation:flap .5s ease-in-out infinite}
.flutter{animation:flutter 7s ease-in-out infinite}
.float{animation:float 8s ease-in-out infinite}
.dangle{transform-box:fill-box;transform-origin:top center;animation:sway 5s ease-in-out infinite}
.kick{animation:kick 1.2s ease-in-out infinite}
@keyframes hop{0%,30%,100%{transform:translateY(0)}55%{transform:translateY(-26px)}}
@keyframes squish{0%,100%{transform:scale(1,1)}20%{transform:scale(1.12,.85)}35%{transform:scale(.92,1.1)}70%{transform:scale(1,1)}78%{transform:scale(1.1,.88)}}
@keyframes wobble{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes peek{0%,50%,100%{transform:translateY(0)}58%,84%{transform:translateY(-52px)}62%,70%{transform:translate(4px,-52px)}}
@keyframes zz{0%{transform:translate(0,0);opacity:0}15%{opacity:1}100%{transform:translate(26px,-60px);opacity:0}}
@keyframes flap{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.2)}}
@keyframes flutter{0%,100%{transform:translate(0,0)}25%{transform:translate(40px,-30px)}50%{transform:translate(80px,0)}75%{transform:translate(30px,20px)}}
@keyframes float{0%,100%{transform:translate(0,0)}50%{transform:translate(-8px,-18px)}}
@keyframes kick{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-1600px)}}
@keyframes tw{0%,100%{opacity:.9}50%{opacity:.25}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes blink{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes cur{0%{opacity:1}50%{opacity:0}}
@keyframes fly{0%,100%{transform:translate(0,0);opacity:.2}50%{transform:translate(14px,-22px);opacity:1}}
@keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
`
}

function cloud(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path class="cloud" d="M0 40a30 30 0 0 1 30-30a42 42 0 0 1 78-6a32 32 0 0 1 52 22a22 22 0 0 1 4 44H8a20 20 0 0 1-8-30z"/></g>`
}

export function buildScene() {
  const rand = rng(118)
  // clouds, twice across so the drift loops without a seam
  let big = '', small = ''
  for (const off of [0, 1600]) {
    big += cloud(140 + off, 120, 1.1) + cloud(1050 + off, 90, 0.9)
    small += cloud(620 + off, 210, 0.7) + cloud(1400 + off, 290, 0.55)
  }
  let stars = ''
  for (let i = 0; i < 70; i++) {
    const x = Math.round(rand() * 1600), y = Math.round(rand() * 560), r = (rand() * 1.6 + 0.6).toFixed(1)
    stars += `<circle class="dot tw tw${i % 3}" cx="${x}" cy="${y}" r="${r}"/>`
  }

  // the critter's corner: 400 x 250 units pinned to the bottom-right
  const P = 6
  const cx = 880, cy = 488 // critter's top-left
  const tufts = [[770, 556], [792, 552], [975, 548], [990, 556], [745, 562]]
    .map(([x, y], i) => `<path class="tuft sway" style="animation-delay:${i * 0.9}s" d="M${x} ${y}l3-12l2 12l4-9l1 9z"/>`).join('')
  const leftTufts = [[180, 540], [292, 538], [306, 542], [430, 566], [480, 588]]
    .map(([x, y], i) => `<path class="tuft sway" style="animation-delay:${i * 0.7}s" d="M${x} ${y}l3-12l2 12l4-9l1 9z"/>`).join('')
  const zeds = [0, 1, 2].map(i => `<g class="zz zz${i}">${sprite(ZED, 384, 470, 4)}</g>`).join('')
  // the friends' corner: pinned to the bottom-left, clear of the words in the middle
  const left = `
<svg x="0" y="0" width="100%" height="100%" viewBox="0 0 1000 625" preserveAspectRatio="xMinYMax meet" overflow="visible">
  <path class="front" d="M-60 625V548C150 530 380 535 560 625z"/>
  ${leftTufts}
  <g>${sprite(PLAIN, 196, 486, 6, COATS.peach)}</g>
  <g class="wobble"><g class="kick">${sprite(SHADES, 196, 432, 6, COATS.lilac)}</g></g>
  <g class="day"><g class="hop"><g class="squish">
    ${sprite(DERP, 312, 498, 6, COATS.mint)}
    <g transform="rotate(-18 348 492)">${sprite(HAT, 312, 462, 6)}</g>
  </g></g></g>
  <g class="night">
    ${sprite(SLEEPY, 312, 498, 6, COATS.mint)}
    <g transform="rotate(-18 348 492)">${sprite(HAT, 312, 462, 6)}</g>
    ${zeds}
  </g>
  <g class="day"><g class="flutter"><g transform="translate(296 408)">
    <g class="flap"><path fill="#f6a5c0" d="M0 0c-14-12-22 4-10 10c-12 6-4 18 10 6z"/><path fill="#f6a5c0" d="M0 0c14-12 22 4 10 10c12 6 4 18-10 6z"/><rect x="-1" y="-4" width="2" height="16" fill="#4b4352"/></g>
  </g></g></g>
</svg>`

  const corner = `
<svg x="0" y="0" width="100%" height="100%" viewBox="0 0 1000 625" preserveAspectRatio="xMaxYMax meet" overflow="visible">
  <defs><radialGradient id="lamp"><stop class="glow" offset="0" stop-opacity=".35"/><stop class="glow" offset="1" stop-opacity="0"/></radialGradient></defs>
  <g class="float"><g transform="translate(806 236)"><g class="dangle">
    <ellipse cx="0" cy="0" rx="26" ry="32" fill="#e8657a"/><ellipse cx="-9" cy="-11" rx="6" ry="9" fill="#f5a3b0"/>
    <path d="M-4 31h8l-4 6z" fill="#c94f63"/><path d="M0 37v46" stroke="#4b4352" stroke-width="1.5" fill="none"/>
    ${sprite(PLAIN, -21, 83, 3, COATS.orange)}
  </g></g></g>
  <g class="peek">${sprite(PEEKER, 728, 578, 4, COATS.orange)}</g>
  <path class="front" d="M560 625C620 575 730 545 860 543S990 548 1040 556V625z"/>
  ${tufts}
  <g transform="translate(796 502)">
    <g class="night"><circle cx="30" cy="18" r="46" fill="url(#lamp)"/></g>
    ${pixels(LAPTOP, 0, 0, 5)}
    <rect class="code1 cur" x="40" y="20" width="5" height="5"/>
  </g>
  <g>${pixels(LEGS, cx, cy + CRITTER.length * P, P)}</g>
  <g class="bob">
    ${pixels(CRITTER, cx, cy, P, 'OSHP')}
    <g class="blink">${pixels(CRITTER, cx, cy, P, 'E')}</g>
  </g>
  <g class="night">
    <circle class="dot fly" cx="842" cy="470" r="2.2"/>
    <circle class="dot fly fly1" cx="975" cy="462" r="1.8"/>
    <circle class="dot fly fly2" cx="925" cy="440" r="2"/>
  </g>
</svg>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<style>${css()}</style>
<svg width="100%" height="100%" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop class="s0" offset="0"/><stop class="s1" offset=".55"/><stop class="s2" offset="1"/>
    </linearGradient>
    <mask id="cres"><rect width="1600" height="1000" fill="#fff"/><circle cx="1298" cy="210" r="50" fill="#000"/></mask>
    <radialGradient id="halo"><stop class="s2" offset="0" stop-opacity=".9"/><stop class="s2" offset="1" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#sky)"/>
  <circle cx="1270" cy="230" r="150" fill="url(#halo)" opacity=".7"/>
  <circle class="halo" cx="1270" cy="230" r="78" opacity=".45"/>
  <circle class="sun day" cx="1270" cy="230" r="56"/>
  <circle class="sun night" cx="1270" cy="230" r="56" mask="url(#cres)"/>
  <g class="night">${stars}</g>
  <g class="day" opacity=".85"><g class="drift">${big}</g><g class="drift2">${small}</g></g>
  <path class="far" d="M0 690C180 610 360 600 540 650S900 700 1080 630S1420 560 1600 620V1000H0z"/>
  <path class="mid" d="M0 780C220 720 420 730 640 770S1060 820 1260 760S1500 720 1600 740V1000H0z"/>
  <path class="near" d="M0 870C260 830 520 840 800 870S1300 900 1600 850V1000H0z"/>
</svg>
${left}
${corner}
</svg>`
}
