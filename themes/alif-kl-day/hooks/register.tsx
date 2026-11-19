import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildScene } from './scene.js'

// A pixel-art Kuala Lumpur by day: a bright blue sky with pixel clouds and sun, a dense skyline of Menara KL, the Petronas Twin Towers, Merdeka Maybank and The Exchange 106, and a grass strip along the bottom.
const { theme, problems } = makeColors({
  label: 'alif-kl-day',
  only: 'light',
  roles: { accent: '#1a63d1', danger: '#c0392b', success: '#2f8f4d', warning: '#b8741a', pro: '#5b4fd1' },
  light: { gray: { anchors: { 'surface-0': '#d6e8fb', 'surface-1': '#e6f1fd', 'surface-2': '#f5faff', 'text-primary': '#0a2a5c', 'text-secondary': '#2a4a80', 'text-muted': '#3d5d92' } } },
})

// The scene is drawn by scene.js: a 200 x 125 pixel grid, nearer buildings hiding farther ones, anchored to the bottom of the window so the skyline stays low on any screen shape.
const SCENE = buildScene('day')

const LOOK: ThemeSetArgs = { colors: theme, overrideColorScheme: 'light', backdrop: { scene: 'kl-pixel', glass: { blur: 8, tint: '#eaf4ff', opacity: 0.6 } } }

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
