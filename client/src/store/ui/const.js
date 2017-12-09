import Drawer from 'react-md/lib/Drawers'

export const UI = 'ui'
export const INFO = 'info'
export const ERROR = 'error'
export const SUCCESS = 'success'
export const UI_MEDIA = 'media'
export const UI_PAGES = 'pages'

const { mobile, tablet, desktop } = Drawer.getCurrentMedia()
let defaultMedia = 'mobile'
if (desktop) {
  defaultMedia = 'desktop'
} else if (tablet) {
  defaultMedia = 'tablet'
}

export const UI_INITIAL_STATE = {
  toasts: [],
  loading: false,
  drawerVisible: false,
  secondToolbarVisible: false,
  [UI_MEDIA]: {
    mobile,
    tablet,
    desktop,
    defaultMedia,
  },
  [UI_PAGES]: {},
  dialogs: {},
}
