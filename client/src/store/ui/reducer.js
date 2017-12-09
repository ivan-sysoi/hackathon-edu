import * as actions from './actions'
import * as c from './const'


const uiReducer = (state = c.UI_INITIAL_STATE, action) => {
  let toasts
  switch (action.type) {
    case actions.ADD_TOAST:
      toasts = [...(state.toasts || []), { ...action.payload }]
      return {
        ...state,
        toasts,
      }
    case actions.REMOVE_TOAST:
      toasts = [...(state.toasts || [])]
      toasts.shift()
      return {
        ...state,
        toasts,
      }
    case actions.BEGIN_LOADING:
      return {
        ...state,
        loading: true,
      }
    case actions.FINISH_LOADING:
      return {
        ...state,
        loading: false,
      }
    case actions.SHOW_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.payload.name]: {
            visible: true,
            data: action.payload.data,
          },
        },
      }
    case actions.HIDE_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.payload.name]: {
            visible: false,
          },
        },
      }
    default:
      return state
  }
}

export default uiReducer
