import { Promise } from 'es6-promise'

import { UI, UI_MEDIA, UI_INITIAL_STATE } from 'store/ui/const'
import { AUTH } from 'store/auth/const'
import { selectTeacherUser } from 'store/auth/selectors'


export function getInitialUIData(req) {
  const userAgent = req.header('user-agent')
  const mobile = !!userAgent.match(/mobile/i)
  const tablet = !!userAgent.match(/ipad/i)
  const desktop = !mobile && !tablet
  let defaultMedia = 'desktop'
  if (tablet) {
    defaultMedia = 'tablet'
  } else if (mobile) {
    defaultMedia = 'mobile'
  }
  return Object.assign(
    {},
    UI_INITIAL_STATE,
    {
      [UI_MEDIA]: { mobile, tablet, desktop, defaultMedia },
    },
  )
}

export function getInitialStoreData(req, res) {
  return new Promise((resolve) => {
    resolve({
      [UI]: getInitialUIData(req),
      [AUTH]: {
        currentUser: selectTeacherUser(),
      },
    })
  })
}
