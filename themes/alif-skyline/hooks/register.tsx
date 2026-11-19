import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// The portfolio's two palettes. Light is the cool paper the site uses by day (cobalt ink on pale blue);
// dark is the night city (deep navy surfaces, sky-blue accent). Gold, from the site's lit windows, is the warning colour.
const { theme, problems } = makeColors({
  label: 'Alif Skyline',
  roles: { accent: '#1559c9', danger: '#c0392b', success: '#2e8b6a', warning: '#a86d12', pro: '#5b4fd1' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e7f0f9',
        'surface-1': '#f1f6fb',
        'surface-2': '#fbfdff',
        'text-primary': '#0b2a6b',
        'text-secondary': '#2b4a86',
        'text-muted': '#3f5b94',
      },
    },
  },
  dark: {
    roles: { accent: '#7fd3ff', warning: '#e3b14e', pro: '#9d93ff', success: '#4fd1a5', danger: '#ff8b7d' },
    gray: {
      anchors: {
        'surface-0': '#050912',
        'surface-1': '#08122a',
        'surface-2': '#0b1830',
        'surface-3': '#0f1f3d',
        'text-primary': '#d6ecff',
        'text-secondary': '#b1cfeb',
        'text-muted': '#8fb2d8',
      },
    },
  },
})

// A faint scene behind the chat: stars and a ringed moon at the top right, the skyline along the bottom right.
// Everything is translucent blue, so it reads on both the pale and the night palette. The skyline and moon sit at the
// right edge and slide in on narrow screens (the box is cropped to its middle there), clear of the words and the message box.
const STARS: Array<[number, number, number]> = [
  [90, 80, 1.6], [210, 150, 1.2], [340, 60, 1.4], [470, 190, 1.1], [600, 90, 1.5], [720, 230, 1.2], [830, 70, 1.3], [940, 170, 1.6],
  [1050, 110, 1.2], [1160, 60, 1.4], [150, 300, 1.2], [300, 380, 1.5], [520, 330, 1.1], [700, 420, 1.3], [880, 330, 1.2], [1010, 400, 1.5],
  [1120, 260, 1.1], [60, 470, 1.4], [420, 480, 1.2], [780, 500, 1.1],
]

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
.tw{animation:tw 5s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.15}50%{opacity:.7}}
.ring{transform-box:fill-box;transform-origin:center;animation:spin 90s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.win{animation:tw 6s ease-in-out infinite}
.moon,.sky{transform:translate(0,0)}
@media (max-aspect-ratio:3/2){.moon{transform:translate(-170px,0)}.sky{transform:translate(-150px,0)}}
@media (max-aspect-ratio:1/1){.moon{transform:translate(-520px,0)}.sky{transform:translate(-480px,0)}}
</style>
<defs><radialGradient id="g" cx="1350" cy="190" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4f8cff" stop-opacity=".22"/><stop offset="1" stop-color="#4f8cff" stop-opacity="0"/></radialGradient></defs>
<g class="moon"><circle cx="1350" cy="190" r="520" fill="url(#g)"/>
<g fill="#4f8cff">${STARS.map(([x, y, r], i) => `<circle class="tw" cx="${x + 520}" cy="${y}" r="${r}" style="animation-delay:${(i % 7) * 0.7}s"/>`).join('')}</g>
<circle cx="1350" cy="190" r="64" fill="#4f8cff" fill-opacity=".26"/><circle cx="1332" cy="172" r="12" fill="#4f8cff" fill-opacity=".18"/><circle cx="1372" cy="212" r="9" fill="#4f8cff" fill-opacity=".18"/><circle cx="1366" cy="164" r="6" fill="#4f8cff" fill-opacity=".18"/>
<g class="ring" fill="none" stroke="#4f8cff" stroke-opacity=".42" stroke-width="2"><ellipse cx="1350" cy="190" rx="120" ry="30" transform="rotate(-18 1350 190)"/><ellipse cx="1350" cy="190" rx="150" ry="44" transform="rotate(-18 1350 190)" stroke-opacity=".22"/><circle cx="1460" cy="160" r="7" fill="#4f8cff" fill-opacity=".5" stroke="none"/></g></g>
<g class="sky" fill="#4f8cff" fill-opacity=".17">
<path d="M1318 1000V570l12-110h20l12 110v430z"/><path d="M1388 1000V570l12-110h20l12 110v430z"/><rect x="1362" y="690" width="26" height="9"/><rect x="1338" y="398" width="2" height="62"/><rect x="1408" y="398" width="2" height="62"/>
<rect x="1225" y="650" width="10" height="350"/><ellipse cx="1230" cy="640" rx="22" ry="14"/><rect x="1229" y="540" width="2" height="100"/>
<path d="M1470 1000V480l20-150h40l-20 150v520z"/><rect x="1509" y="250" width="2" height="80"/>
<path d="M1552 1000V570l10-40h38v470z"/><rect x="1180" y="860" width="36" height="140"/><rect x="1262" y="800" width="30" height="200"/></g>
<g class="sky" fill="#ffd36b"><rect class="win" x="1336" y="560" width="4" height="4" style="animation-delay:.4s"/><rect class="win" x="1404" y="610" width="4" height="4" style="animation-delay:1.8s"/><rect class="win" x="1490" y="520" width="4" height="4" style="animation-delay:2.6s"/><rect class="win" x="1500" y="700" width="4" height="4" style="animation-delay:3.4s"/><rect class="win" x="1574" y="640" width="4" height="4" style="animation-delay:1.1s"/><rect class="win" x="1190" y="900" width="4" height="4" style="animation-delay:4.2s"/></g>
<g class="sky" fill="none" stroke="#4f8cff" stroke-opacity=".3" stroke-width="2"><ellipse cx="1380" cy="985" rx="330" ry="26"/></g>
</svg>`

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'skyline', glass: false } }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // While you build: the line that would stop Desktop painting this look.
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    if (e.props.scene !== 'skyline') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A faint Kuala Lumpur skyline and a ringed moon" isInteractive />
  })
}
