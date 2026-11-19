// A smooth vector Kuala Lumpur skyline, seen from the west looking east, so the landmarks stand in their real
// north-to-south order: Four Seasons Place and the Petronas Twin Towers on the left, Menara KL on Bukit Nanas
// left of centre, and The Exchange 106 just left of the Merdeka Maybank Tower on the right.
// Drawn at 0.6 units a metre, then each landmark is scaled up by a third about its base (0.8 units a metre),
// so heights stay true to each other. The ground line is y 800 of the 1600 x 1000 ground.
// Colours are classes, so the same drawing serves day (hazy pastel) and night (dark, lit).

const K = 0.6
const BASE = 800
const UP = 4 / 3
const big = (cx, body) => `<g transform="translate(${cx} ${BASE}) scale(${UP}) translate(${-cx} ${-BASE})">${body}</g>`

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }
const n = v => Math.round(v * 10) / 10
const poly = pts => 'M' + pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L') + 'Z'
// a symmetric outline from the left half's points, bottom to top
const mirror = (cx, left) => poly([...left, ...left.slice().reverse().map(([x, y]) => [2 * cx - x, y])])

// Petronas Twin Towers, 452 m: a 30-unit shaft, four setbacks, then the pinnacle with its ball
function petronasTower(cx) {
  const H = 452 * K, y = f => BASE - f * H
  const tiers = [[15, 0.60], [13, 0.69], [11, 0.76], [8.5, 0.81], [6, 0.845]]
  const left = [[cx - 15, BASE]]
  tiers.forEach(([hw, top], i) => {
    left.push([cx - hw, y(top) + 2])
    const next = tiers[i + 1]
    if (next) left.push([cx - next[0], y(top) - 1])
  })
  left.push([cx - 3.2, y(0.845)], [cx - 1.4, y(0.96)], [cx - 0.5, y(0.995)], [cx, y(1)])
  return { d: mirror(cx, left), ball: [cx, y(0.885)] }
}

function petronas(cxL, cxR) {
  const H = 452 * K, y = f => BASE - f * H
  const L = petronasTower(cxL), R = petronasTower(cxR)
  // the 44-storey annexes on the outer sides
  const annex = (x0, w) => `M${x0} ${BASE}V${n(y(0.36))}q${w / 2} -8 ${w} 0V${BASE}Z`
  const bridgeY = y(0.376), legY = y(0.27), mid = (cxL + cxR) / 2
  const bridge = `M${cxL + 15} ${n(bridgeY)}H${cxR - 15}v6H${cxL + 15}Z`
  const legs = `M${mid - 2} ${n(bridgeY + 6)}L${cxL + 15} ${n(legY)}v3L${mid - 4} ${n(bridgeY + 7)}Z M${mid + 2} ${n(bridgeY + 6)}L${cxR - 15} ${n(legY)}v3L${mid + 4} ${n(bridgeY + 7)}Z`
  return `
  <path class="petS" d="${annex(cxL - 23, 12)}${annex(cxR + 11, 12)}"/>
  <path fill="url(#petg)" d="${L.d}"/><path fill="url(#petg)" d="${R.d}"/>
  <g clip-path="url(#petclip)"><rect x="${cxL - 16}" y="${n(y(1))}" width="${cxR - cxL + 32}" height="${n(H)}" fill="url(#fins)"/></g>
  <circle class="petH" cx="${L.ball[0]}" cy="${n(L.ball[1])}" r="2.6"/><circle class="petH" cx="${R.ball[0]}" cy="${n(R.ball[1])}" r="2.6"/>
  <path class="petS" d="${bridge}${legs}"/>
  <clipPath id="petclip"><path d="${L.d}"/><path d="${R.d}"/></clipPath>`
}

// Menara Kuala Lumpur, 421 m, on Bukit Nanas: flared base, tapering shaft, the pod, then the stepped antenna
function menaraKL(cx) {
  const yb = BASE - 22, H = 421 * K, y = f => yb - f * H
  const left = [
    [cx - 20, yb + 2], [cx - 9, y(0.035)], [cx - 6, y(0.07)], [cx - 4.2, y(0.6)],
    [cx - 11, y(0.625)], [cx - 17, y(0.64)], [cx - 17, y(0.668)], [cx - 14.5, y(0.676)], [cx - 15.5, y(0.695)],
    [cx - 9, y(0.715)], [cx - 4, y(0.728)], [cx - 3, y(0.73)], [cx - 3, y(0.80)], [cx - 1.8, y(0.815)],
    [cx - 1.8, y(0.9)], [cx - 0.8, y(0.912)], [cx - 0.6, y(0.995)], [cx, y(1)],
  ]
  return `
  <path class="nanas" d="M${cx - 120} ${BASE + 6}C${cx - 70} ${yb + 10} ${cx - 40} ${yb - 4} ${cx} ${yb - 4}S${cx + 70} ${yb + 10} ${cx + 120} ${BASE + 6}Z"/>
  <path class="lm" d="${mirror(cx, left)}"/>
  <path class="lmH" d="M${cx - 4} ${n(y(0.07))}L${cx - 3} ${n(y(0.6))}H${cx - 1.6}L${cx - 2} ${n(y(0.07))}Z"/>
  <path class="pod" d="M${cx - 16.5} ${n(y(0.648))}H${cx + 16.5}v${n(0.012 * H)}H${cx - 16.5}Z M${cx - 14} ${n(y(0.688))}H${cx + 14}v3H${cx - 14}Z"/>
  <circle class="beacon blinkB" cx="${cx}" cy="${n(y(1))}" r="2"/>`
}

// Merdeka Maybank Tower, 679 m: a gently tapering faceted body, a crown of planes closing in, and the long spire
function merdeka(cx) {
  const H = 679 * K, y = f => BASE - f * H
  const hw = f => 20 - (20 - 13.5) * (f / 0.70) // half width along the body
  const left = [[cx - 20, BASE], [cx - 13.5, y(0.70)], [cx - 10, y(0.725)], [cx - 6.5, y(0.75)], [cx - 3, y(0.762)], [cx - 1.2, y(0.95)], [cx - 0.5, y(0.995)], [cx, y(1)]]
  // a zigzag fold up the face, shaded on the right, like the tower's faceted panels
  const zig = []
  for (let f = 0, i = 0; f <= 0.70; f += 0.0875, i++) zig.push([cx + (i % 2 ? 4 : -4) * (hw(f) / 20), y(f)])
  const shade = poly([...zig, [cx + 3, y(0.762)], [cx + 6.5, y(0.75)], [cx + 10, y(0.725)], [cx + 13.5, y(0.70)], [cx + 20, BASE]])
  let facets = ''
  for (let f = 0.0875; f < 0.70; f += 0.0875) {
    const w = hw(f)
    facets += `M${n(cx - w)} ${n(y(f) + 10)}L${n(cx)} ${n(y(f))}L${n(cx + w)} ${n(y(f) + 10)}`
  }
  return `
  <path class="lm" d="${mirror(cx, left)}"/>
  <path class="lmS" d="${shade}"/>
  <path class="edge" d="${facets}" fill="none" stroke-width="0.8"/>
  <path class="crown" d="M${cx - 13.5} ${n(y(0.70))}L${cx - 3} ${n(y(0.762))}L${cx} ${n(y(1))}L${cx + 3} ${n(y(0.762))}L${cx + 13.5} ${n(y(0.70))}" fill="none" stroke-width="1"/>
  <circle class="beacon blinkB" style="animation-delay:-.7s" cx="${cx}" cy="${n(y(1))}" r="2.2"/>`
}

// The Exchange 106, 445 m: a slim shaft with a pointed crown split by a slot
function exchange(cx) {
  const H = 445 * K, y = f => BASE - f * H
  const left = [[cx - 14, BASE], [cx - 14, y(0.86)], [cx - 6, y(0.965)], [cx - 1, y(0.995)], [cx, y(1)]]
  return `
  <path class="lm" d="${mirror(cx, left)}"/>
  <path class="lmS" d="M${cx} ${n(y(1))}L${cx + 14} ${n(y(0.86))}V${BASE}H${cx + 4}V${n(y(0.86))}Z"/>
  <path class="lmH" d="M${cx - 1} ${n(y(0.985))}V${n(y(0.9))}h2V${n(y(0.985))}Z M${cx - 9} ${BASE}V${n(y(0.83))}h1.4V${BASE}Z"/>
  <path class="crown" d="M${cx - 14} ${n(y(0.86))}L${cx} ${n(y(1))}L${cx + 14} ${n(y(0.86))}M${cx} ${n(y(1))}V${n(y(0.86))}" fill="none" stroke-width="1.2"/>`
}

// Four Seasons Place, 343 m: a slim tower whose top rises in a curve toward one side
function fourSeasons(cx) {
  const H = 343 * K, y = f => BASE - f * H
  return `
  <path class="lm" d="M${cx - 12} ${BASE}V${n(y(0.9))}Q${cx} ${n(y(0.93))} ${cx + 12} ${n(y(1))}V${BASE}Z"/>
  <path class="lmS" d="M${cx + 4} ${BASE}V${n(y(0.965))}Q${cx + 8} ${n(y(0.98))} ${cx + 12} ${n(y(1))}V${BASE}Z"/>`
}

// plain blocks to fill the city, kept clear of the landmarks' tops
function blocks(seed, minH, maxH, minW, maxW) {
  const rand = rng(seed)
  let x = -10, d = ''
  while (x < 1610) {
    const w = minW + rand() * (maxW - minW), h = minH + rand() * (maxH - minH)
    const top = BASE - h
    if (rand() < 0.3) d += `M${n(x)} ${BASE}V${n(top + 6)}L${n(x + w / 2)} ${n(top)}L${n(x + w)} ${n(top + 6)}V${BASE}Z`
    else d += `M${n(x)} ${BASE}V${n(top)}H${n(x + w)}V${BASE}Z`
    x += w + rand() * 6
  }
  return d
}

export function skylineDefs() {
  return `
  <linearGradient id="petg" x1="0" y1="0" x2="1" y2="0">
    <stop class="pg0" offset="0"/><stop class="pg1" offset=".32"/><stop class="pg2" offset=".62"/><stop class="pg0" offset="1"/>
  </linearGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop class="s2" offset="0" stop-opacity="0"/><stop class="s2" offset="1" stop-opacity=".75"/></linearGradient>
  <pattern id="fins" width="3" height="10" patternUnits="userSpaceOnUse"><rect class="fin" width="1" height="10"/></pattern>
  <pattern id="winA" width="10" height="12" patternUnits="userSpaceOnUse"><rect class="win" x="2" y="3" width="3" height="5"/></pattern>
  <pattern id="winB" width="10" height="12" patternUnits="userSpaceOnUse"><rect class="win" x="6" y="3" width="3" height="5"/></pattern>`
}

export function skyline() {
  const far = blocks(1957, 40, 150, 18, 44)
  const near = blocks(118, 18, 70, 22, 50)
  return `
  <clipPath id="farclip"><path d="${far}"/></clipPath>
  <clipPath id="nearclip"><path d="${near}"/></clipPath>
  <path class="cityF" d="${far}"/>
  <g clip-path="url(#farclip)"><rect class="winTw" y="560" width="1600" height="240" fill="url(#winA)" opacity=".55"/><rect class="winTw winTw2" y="560" width="1600" height="240" fill="url(#winB)" opacity=".55"/></g>
  ${big(428, fourSeasons(428))}
  ${big(500, petronas(471, 529))}
  ${big(790, menaraKL(790))}
  ${big(1338, exchange(1338))}
  ${big(1410, merdeka(1410))}
  <path class="cityN" d="${near}"/>
  <g clip-path="url(#nearclip)"><rect class="winTw winTw2" y="700" width="1600" height="100" fill="url(#winA)" opacity=".8"/><rect class="winTw" y="700" width="1600" height="100" fill="url(#winB)" opacity=".8"/></g>
  <rect y="600" width="1600" height="210" fill="url(#haze)"/>`
}
