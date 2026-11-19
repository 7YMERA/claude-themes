import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// The Kuala Lumpur skyline behind the critter meadow, held at morning (light) whatever mode the app is in. Peach morning paper and terracotta ink by day,
// plum night with warm lamp-lit text by dark. One plugin serves both modes: the scene swaps palettes by itself.
const { theme, problems } = makeColors({
  label: 'alif-kl-meadow',
  roles: { accent: '#c15f3c', danger: '#b3392f', success: '#4e7d3a', warning: '#a86f14', pro: '#7a5aa6' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f6ece2',
        'surface-1': '#f9f1e8',
        'surface-2': '#fdf8f2',
        'text-primary': '#2b211c',
        'text-secondary': '#55463d',
        'text-muted': '#6b5b50',
      },
    },
  },
  dark: {
    roles: { accent: '#e88a65', danger: '#ff8f7f', success: '#8fcf7a', warning: '#f2c46b', pro: '#c3a8f0' },
    gray: {
      anchors: {
        'surface-0': '#16132a',
        'surface-1': '#1c1832',
        'surface-2': '#221e3b',
        'surface-3': '#272241',
        'text-primary': '#f5ece4',
        'text-secondary': '#d6c9c0',
        'text-muted': '#b0a2a8',
      },
    },
  },
})

const SCENE = buildScene()

// glass with no tint takes each mode's own panel colour, so one veil works by day and by night
const LOOK: ThemeSetArgs = { colors: theme, overrideColorScheme: 'light', backdrop: { scene: 'kl-meadow', glass: { blur: 10, opacity: 0.55 } } }

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

    if (e.props.scene !== 'kl-meadow') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="The Kuala Lumpur skyline (Petronas Twin Towers, Menara KL, The Exchange 106 and Merdeka Maybank Tower) behind a meadow full of goofy pixel critters" isInteractive />
  })
}
