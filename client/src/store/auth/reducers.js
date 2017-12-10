import * as actions from './actions'

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: {
          ...action.payload,
        },
      }
    }
    default:
      return state
  }
}

export default authReducer
