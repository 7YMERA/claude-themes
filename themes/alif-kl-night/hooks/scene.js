// A pixel-art Kuala Lumpur skyline for the chat's backdrop. 200 x 125 cells, drawn as a grid so nearer buildings hide farther ones,
// then written out as one path per colour (crisp edges). Day and night share the drawing; only the palette and the sky objects change.
const W = 200, H = 125, CELL = 8, BASE = 119

const PAL = {
  day: {
    skyTop: [0x2a, 0x6c, 0xd2], skyBot: [0xc4, 0xe6, 0xff],
    far: '#9dbfe6', farB: '#8fb3df', mid: '#6f9bd3', midB: '#628fc9', near: '#4a7bc2', nearB: '#3f6fb6', lm: '#2f5fae', lmB: '#3a6cbc', lmC: '#2a559f',
    win: '#d8ecff', winLm: '#bfe0ff', grass: '#4caf50', grassD: '#2f8f3d', grassL: '#7fd05f', dirt: '#2a6b34',
    sun: '#ffd84a', sunHalo: '#ffe98a', cloud: '#ffffff', cloudS: '#dcecfb', twinkle: false,
  },
  night: {
    skyTop: [0x04, 0x08, 0x24], skyBot: [0x1c, 0x3f, 0x86],
    far: '#1b3a78', farB: '#183570', mid: '#132d62', midB: '#102858', near: '#0c2049', nearB: '#0a1b40', lm: '#0a1a3d', lmB: '#10244f', lmC: '#08153a',
    win: '#ffd36b', winLm: '#ffe9a6', grass: '#1d6b3a', grassD: '#124d2a', grassL: '#2f8f4d', dirt: '#0d3a22',
    sun: '#f4f0d2', sunHalo: '#7f93c7', cloud: '#2a4a8c', cloudS: '#223d78', twinkle: true,
  },
}

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }

export function buildScene(mode) {
  const P = PAL[mode], night = mode === 'night', rand = rng(night ? 777 : 2026)
  const grid = new Array(W * H).fill(null)
  const put = (x, y, k) => { if (x >= 0 && x < W && y >= 0 && y < H) grid[y * W + x] = k }
  const rect = (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, k) }
  const colors = { far: P.far, farB: P.farB, mid: P.mid, midB: P.midB, near: P.near, nearB: P.nearB, lm: P.lm, lmB: P.lmB, lmC: P.lmC, winLm: P.winLm, grass: P.grass, grassD: P.grassD, grassL: P.grassL, dirt: P.dirt }
  // window colours: three groups so night windows can twinkle out of step; day windows are one still colour
  const wk = i => 'w' + (i % 3)
  for (let i = 0; i < 3; i++) colors['w' + i] = P.win

  // a block building: body, shaded side stripe, small roof box, scattered windows
  function block(x, w, h, body, side, win, density, step) {
    const top = BASE - h
    rect(x, top, w, h, body)
    if (w > 3) rect(x + w - 1, top, 1, h, side)
    if (rand() < 0.5) rect(x + 1 + Math.floor(rand() * Math.max(1, w - 3)), top - 1, Math.max(1, Math.floor(w / 3)), 1, body)
    if (win) for (let y = top + 2; y < BASE - 1; y += step) for (let c = x + 1; c < x + w - 1; c += 2) if (rand() < density) put(c, y, wk(Math.floor(rand() * 3)))
  }
  function skyline(from, to, minW, maxW, minH, maxH, body, side, win, density, step) {
    let x = from
    while (x < to) { const w = minW + Math.floor(rand() * (maxW - minW + 1)), h = minH + Math.floor(rand() * (maxH - minH + 1)); block(x, w, h, body, side, win, density, step); x += w + (rand() < 0.3 ? 1 : 0) }
  }

  // layer 1: far, pale, dense
  skyline(-2, W + 2, 4, 8, 10, 30, 'far', 'farB', false, 0, 3)
  // layer 2: middle
  skyline(-2, W + 2, 5, 9, 12, 36, 'mid', 'midB', true, night ? 0.5 : 0.3, 3)

  // landmarks (drawn after the middle layer, so they stand in front of it)
  // Menara KL: shaft, pod, mast
  const mk = 40
  rect(mk, BASE - 42, 2, 42, 'lm'); rect(mk + 1, BASE - 42, 1, 42, 'lmB')
  rect(mk - 3, BASE - 40, 8, 2, 'lm'); rect(mk - 4, BASE - 38, 10, 4, 'lm'); rect(mk - 3, BASE - 34, 8, 2, 'lm'); rect(mk - 2, BASE - 32, 6, 1, 'lmB')
  rect(mk - 3, BASE - 37, 8, 1, 'winLm'); rect(mk - 2, BASE - 35, 6, 1, 'winLm')
  rect(mk, BASE - 50, 2, 9, 'lm'); rect(mk, BASE - 62, 1, 12, 'lm')
  // Petronas Twin Towers: stepped, fluted, with the skybridge and spires
  const tower = cx => {
    const steps = [[0, 34, 10], [34, 42, 8], [42, 48, 6], [48, 53, 4], [53, 57, 2]]
    for (const [a, b, wd] of steps) { rect(cx - wd / 2, BASE - b, wd, b - a, 'lm'); for (let y = BASE - b; y < BASE - a; y += 1) for (let x = cx - wd / 2; x < cx + wd / 2; x += 2) put(x, y, 'lmB') }
    rect(cx - 1, BASE - 66, 1, 9, 'lm'); rect(cx - 1, BASE - 60, 2, 1, 'lmC')
    for (let y = BASE - 52; y < BASE - 4; y += 4) for (const dx of [-3, 0, 2]) if (rand() < (night ? 0.7 : 0.5)) put(cx + dx, y, wk(Math.floor(rand() * 3)))
  }
  const pa = 92, pb = 108
  tower(pa); tower(pb); rect(pa + 4, BASE - 27, pb - pa - 8, 2, 'lmC')
  // Merdeka Maybank: wide faceted shaft, a slanted crown and a long spire
  const md = 150
  rect(md - 5, BASE - 44, 11, 44, 'lm'); rect(md + 3, BASE - 44, 3, 44, 'lmB')
  for (let k = 0; k < 14; k++) rect(md - 4 + Math.floor(k / 3), BASE - 44 - k * 2, 9 - Math.floor(k / 2), 2, 'lm')
  rect(md + 2, BASE - 80, 2, 10, 'lm'); rect(md + 2, BASE - 92, 1, 12, 'lm')
  for (let y = BASE - 60; y < BASE - 2; y += 3) for (let x = md - 4; x < md + 5; x += 2) if (rand() < (night ? 0.5 : 0.28)) put(x, y, wk(Math.floor(rand() * 3)))
  // The Exchange 106
  const ex = 172
  rect(ex, BASE - 54, 8, 54, 'lm'); rect(ex + 6, BASE - 54, 2, 54, 'lmB'); rect(ex + 1, BASE - 58, 6, 4, 'lm'); rect(ex + 2, BASE - 62, 4, 4, 'lm'); rect(ex + 3, BASE - 70, 2, 8, 'lm')
  for (let y = BASE - 50; y < BASE - 2; y += 3) for (let x = ex + 1; x < ex + 7; x += 2) if (rand() < (night ? 0.55 : 0.3)) put(x, y, wk(Math.floor(rand() * 3)))
  // layer 3: near, dark, low and dense, in front of everything
  skyline(-2, W + 2, 4, 7, 5, 16, 'near', 'nearB', true, night ? 0.5 : 0.25, 3)

  // grass strip along the bottom, with a few tufts and small trees
  rect(0, BASE, W, H - BASE, 'grass'); rect(0, BASE, W, 1, 'grassL'); rect(0, BASE + 3, W, H - BASE - 3, 'grassD')
  for (let x = 0; x < W; x += 2 + Math.floor(rand() * 4)) put(x, BASE - 1, rand() < 0.5 ? 'grass' : 'grassL')
  for (const tx of [14, 62, 128, 188]) { rect(tx, BASE - 4, 1, 4, 'dirt'); rect(tx - 2, BASE - 8, 5, 3, 'grass'); rect(tx - 1, BASE - 10, 3, 2, 'grassL') }

  // one path per colour
  const keys = Object.keys(colors), paths = []
  const cls = k => (night && /^w[012]$/.test(k) ? ` class="t${k[1]}"` : '')
  for (const k of keys) {
    let d = ''
    for (let y = 0; y < H; y++) { let x = 0; while (x < W) { if (grid[y * W + x] === k) { let e = x; while (e < W && grid[y * W + e] === k) e++; d += `M${x} ${y}h${e - x}v1h-${e - x}z`; x = e } else x++ } }
    if (d) paths.push(`<path${cls(k)} fill="${colors[k]}" d="${d}"/>`)
  }

  // sky: stepped bands
  const mix = t => P.skyTop.map((a, i) => Math.round(a + (P.skyBot[i] - a) * t))
  const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('')
  const bands = []
  const N = 22
  for (let i = 0; i < N; i++) { const y = Math.round((i * BASE) / N), y2 = Math.round(((i + 1) * BASE) / N); bands.push(`<rect x="0" y="${y}" width="${W}" height="${y2 - y + 1}" fill="${hex(mix(i / (N - 1)))}"/>`) }

  // sun or moon: a pixel disk
  const disk = (cx, cy, r, k, cutX = null) => { let d = ''; for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y + 0.5)); let x0 = cx - w, x1 = cx + w; if (cutX !== null) { const cw = Math.floor(Math.sqrt(r * r - y * y + 0.5)); x0 = Math.max(x0, cutX - cw + 3) } if (x1 >= x0) d += `M${x0} ${cy + y}h${x1 - x0 + 1}v1h-${x1 - x0 + 1}z` } return `<path fill="${k}" d="${d}"/>` }
  const sky = night ? disk(150, 22, 7, P.sun) + disk(153, 20, 6, hex(mix(0.12 + 0.0))) : disk(130, 24, 10, P.sunHalo) + disk(130, 24, 8, P.sun)

  // clouds (day) or stars (night); they drift or twinkle in CSS
  const cloudRows = ['..XXXX....', '.XXXXXXXX.', 'XXXXXXXXXX', '.SSSSSSSS.']
  const cloud = (x, y, cls) => { let d = '', s = ''; cloudRows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { if (row[i] === 'X') d += `M${x + i} ${y + j}h1v1h-1z`; if (row[i] === 'S') s += `M${x + i} ${y + j}h1v1h-1z` } }); return `<g class="${cls}"><path fill="${P.cloud}" d="${d}"/><path fill="${P.cloudS}" d="${s}"/></g>` }
  let deco = ''
  if (night) {
    for (let g = 0; g < 3; g++) { let d = ''; for (let i = 0; i < 14; i++) d += `M${Math.floor(rand() * W)} ${Math.floor(rand() * 60)}h1v1h-1z`; deco += `<path class="t${g}" fill="#ffffff" d="${d}"/>` }
    deco += cloud(20, 30, 'cl1') + cloud(96, 44, 'cl2')
  } else {
    deco = cloud(12, 14, 'cl1') + cloud(54, 38, 'cl2') + cloud(96, 8, 'cl3') + cloud(164, 36, 'cl1') + cloud(28, 62, 'cl3')
  }

  const css = `.cl1{animation:dr 90s ease-in-out infinite alternate}.cl2{animation:dr 120s ease-in-out infinite alternate-reverse}.cl3{animation:dr 150s ease-in-out infinite alternate}` +
    `@keyframes dr{from{transform:translateX(-12px)}to{transform:translateX(12px)}}` +
    (night ? `.t0{animation:tw 5s ease-in-out infinite}.t1{animation:tw 7s ease-in-out infinite 1.2s}.t2{animation:tw 6s ease-in-out infinite 2.4s}@keyframes tw{0%,100%{opacity:1}50%{opacity:.3}}` : '')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" shape-rendering="crispEdges"><style>${css}</style>${bands.join('')}${sky}${deco}${paths.join('')}</svg>`
}
