import type { Register, ThemeSetArgs } from 'claude-code'

import { problems, theme } from './colors.js'
import { SCENE } from './scene.js'

// Image backgrounds (backdrop: { image: ... }) don't draw in this version of the
// desktop app, so the look uses the animated scene in scene.ts instead.
const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'wired-dusk', glass: { blur: 10, tint: '#0d0a13', opacity: 0.62 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
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
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="Power lines humming at a violet dusk over dark rooftops, with CRT scanlines" isInteractive />
  })
}
