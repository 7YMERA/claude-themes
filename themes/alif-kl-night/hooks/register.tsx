import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// A pixel-art Kuala Lumpur by night: a starry navy sky and crescent moon, the same dense skyline with its windows lit and twinkling, and a dark grass strip along the bottom.
const { theme, problems } = makeColors({
  label: 'alif-kl-night',
  only: 'dark',
  roles: { accent: '#7fb4ff', danger: '#ff8d7d', success: '#5fd48a', warning: '#ffd36b', pro: '#b7a8ff' },
  dark: { gray: { anchors: { 'surface-0': '#050b22', 'surface-1': '#08122e', 'surface-2': '#0c1a40', 'surface-3': '#102250', 'text-primary': '#e8f1ff', 'text-secondary': '#bccdee', 'text-muted': '#93acd6' } } },
})

// The scene is drawn by scene.js: a 200 x 125 pixel grid, nearer buildings hiding farther ones, anchored to the bottom of the window so the skyline stays low on any screen shape.
const SCENE = buildScene('night')

const LOOK: ThemeSetArgs = { colors: theme, overrideColorScheme: 'dark', backdrop: { scene: 'kl-pixel', glass: { blur: 8, tint: '#0a1636', opacity: 0.6 } } }

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

    if (e.props.scene !== 'kl-pixel') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A pixel-art Kuala Lumpur skyline with Menara KL, the Petronas Twin Towers, Merdeka Maybank and The Exchange 106" isInteractive />
  })
}
