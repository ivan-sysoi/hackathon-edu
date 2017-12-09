import { deepEqual } from 'utils'

import * as actions from './actions'
import { getFormState } from './utils'

const formsReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.SET_FORM_DATA: {
      //console.log(`${actions.SET_FORM_DATA}: `, action, getUniqueId())
      const prevData = (state[action.payload.formName] || {}).data || {}
      const curData = action.payload.data || {}
      const isChanged = !deepEqual(curData, prevData)
      //console.log('prev data = ', prevData)
      //console.log('cur data = ', curData)
      //console.log('changed = ', isChanged)

      if (isChanged) {
        const prevId = (state[action.payload.formName] || {}).id || 0
        return {
          ...state,
          [action.payload.formName]: getFormState(
            prevId + 1,
            curData,
          ),
        }
      }
      return state

    }
    //case actions.RESET_FORM_DATA: {
    //  return {
    //    ...state,
    //    [action.payload.formName]: getFormState(
    //      getUniqueId(),
    //      {},
    //    ),
    //  }
    //}
    default:
      return state
  }
}

export default formsReducer
