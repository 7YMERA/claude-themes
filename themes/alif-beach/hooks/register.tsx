import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Day: warm sand paper, deep sea-teal ink, a lagoon accent. Night: a moonlit shoreline, ink-dark teal surfaces, aqua accent, sunset amber for warnings.
const { theme, problems } = makeColors({
  label: 'Alif Beach',
  roles: { accent: '#0b7a86', danger: '#c0392b', success: '#2f8f5b', warning: '#b8651b', pro: '#7a5aa6' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f1e6cc',
        'surface-1': '#f7eed9',
        'surface-2': '#fdf8ea',
        'text-primary': '#0f3640',
        'text-secondary': '#2f5560',
        'text-muted': '#456670',
      },
    },
  },
  dark: {
    roles: { accent: '#5fd4d0', warning: '#f2a65a', pro: '#b79cf0', success: '#58d19b', danger: '#ff8d7d' },
    gray: {
      anchors: {
        'surface-0': '#06151a',
        'surface-1': '#0a1f26',
        'surface-2': '#0e2a33',
        'surface-3': '#12333d',
        'text-primary': '#e6f3f1',
        'text-secondary': '#bcd8d6',
        'text-muted': '#93b8b8',
      },
    },
  },
})

// A faint beach behind the chat. Translucent colours, so it reads on sand and on the night sea. The sun, the palm and the boat sit at the right edge
// and slide in on narrow screens (the box is cropped to its middle there), clear of the words and the message box. The waves drift sideways and the boat bobs (transform only).
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
<style>
@keyframes drift{from{transform:translateX(-34px)}to{transform:translateX(34px)}}
@keyframes bob{from{transform:translateY(-5px) rotate(-1.5deg)}to{transform:translateY(5px) rotate(1.5deg)}}
@keyframes glint{0%,100%{opacity:.1}50%{opacity:.55}}
@keyframes fly{from{transform:translateX(-40px)}to{transform:translateX(40px)}}
.wv{animation:drift 9s ease-in-out infinite alternate}.wv.b{animation-duration:12s;animation-direction:alternate-reverse}.wv.c{animation-duration:15s}
.boat{transform-box:fill-box;transform-origin:center;animation:bob 6s ease-in-out infinite alternate}
.gl{animation:glint 4s ease-in-out infinite}.gull{animation:fly 14s ease-in-out infinite alternate}
.sun,.palm,.shore{transform:translate(0,0)}
@media (max-aspect-ratio:3/2){.sun{transform:translate(-190px,0)}.palm{transform:translate(-170px,0)}.shore{transform:translate(-120px,0)}}
@media (max-aspect-ratio:1/1){.sun{transform:translate(-560px,0)}.palm{transform:translate(-500px,0)}.shore{transform:translate(-330px,0)}}
</style>
<defs>
<radialGradient id="s" cx="1330" cy="170" r="440" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb347" stop-opacity=".3"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
<linearGradient id="sea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1fa3b5" stop-opacity="0"/><stop offset=".45" stop-color="#1fa3b5" stop-opacity=".1"/><stop offset="1" stop-color="#1fa3b5" stop-opacity=".16"/></linearGradient>
</defs>
<g class="sun"><circle cx="1330" cy="170" r="440" fill="url(#s)"/><circle cx="1330" cy="170" r="66" fill="#ffb347" fill-opacity=".34"/>
<g class="gull" fill="none" stroke="#4f7d8a" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"><path d="M1090 250q18-20 36 0q18-20 36 0"/><path d="M1190 215q12-14 24 0q12-14 24 0"/></g></g>
<rect x="0" y="770" width="1600" height="230" fill="url(#sea)"/>
<g fill="none" stroke="#1fa3b5" stroke-width="3" stroke-linecap="round"><g class="wv" stroke-opacity=".3"><path d="M700 800q40-16 80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0t80 0"/></g><g class="wv b" stroke-opacity=".24"><path d="M640 850q50-18 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0"/></g><g class="wv c" stroke-opacity=".2"><path d="M720 910q60-20 120 0t120 0t120 0t120 0t120 0t120 0t120 0t120 0"/></g></g>
<g class="gl" fill="#ffffff"><circle cx="1210" cy="820" r="3"/><circle cx="1330" cy="866" r="2.5"/><circle cx="1450" cy="812" r="3"/><circle cx="1090" cy="880" r="2.5"/></g>
<g class="shore"><path d="M1040 1000Q1260 905 1600 880V1000z" fill="#e4c180" fill-opacity=".26"/><path d="M1180 1000Q1340 940 1600 930V1000z" fill="#d9a85c" fill-opacity=".2"/>
<g class="boat"><path d="M1110 786h72l-12 18h-48z" fill="#7a5a3a" fill-opacity=".38"/><path d="M1146 700v84l38-12z" fill="#ffd9a0" fill-opacity=".55" stroke="#c98a3a" stroke-opacity=".3"/><path d="M1142 716v66l-32-10z" fill="#ffffff" fill-opacity=".4" stroke="#6b8a93" stroke-opacity=".25"/></g></g>
<g class="palm"><path d="M1500 1000Q1470 840 1486 650" fill="none" stroke="#7a5a3a" stroke-opacity=".4" stroke-width="15" stroke-linecap="round"/>
<g fill="#1f8a5b" fill-opacity=".3"><path d="M1486 650Q1420 600 1330 640Q1420 625 1486 650z"/><path d="M1486 650Q1440 570 1360 560Q1430 590 1486 650z"/><path d="M1486 650Q1500 560 1450 500Q1490 580 1486 650z"/><path d="M1486 650Q1560 590 1650 620Q1560 610 1486 650z"/><path d="M1486 650Q1540 570 1620 560Q1550 590 1486 650z"/></g></g>
</svg>`

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'beach', glass: false } }

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

    if (e.props.scene !== 'beach') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A faint beach with a sun, drifting waves, a small boat and a palm" isInteractive />
  })
}
