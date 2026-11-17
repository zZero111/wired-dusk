import { makeColors } from './make-colors.js'

// Near-black with a violet tint, lavender signal, phosphor green.
export const { theme, problems } = makeColors({
  label: 'Wired Dusk',
  only: 'dark',
  roles: { accent: '#9b62e0', danger: '#e0455a', success: '#5fbf6a', warning: '#d79b2b', pro: '#c86bb4' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0d0a13',
        'surface-1': '#14101b',
        'surface-2': '#191421',
        'surface-3': '#1e1826',
        'text-primary': '#ebe6f3',
        'text-secondary': '#c3b9d1',
        'text-muted': '#9d92ab',
      },
    },
  },
})
