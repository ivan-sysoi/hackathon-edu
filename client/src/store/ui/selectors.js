import * as c from './const'

const selectUI = state => state[c.UI] || c.UI_INITIAL_STATE

export const selectMedia = state => selectUI(state)[c.UI_MEDIA] || {}

export const selectIsMobileMedia = state => selectMedia(state).mobile === true

export const selectToasts = state => selectUI(state).toasts || []

export const selectLoading = state => selectUI(state).loading || false

const selectDialogState = (state, name) => selectUI(state).dialogs[name] || {}

export const selectDialogVisible = (state, name) => selectDialogState(state, name).visible || false
export const selectDialogData = (state, name) => selectDialogState(state, name).data || null
