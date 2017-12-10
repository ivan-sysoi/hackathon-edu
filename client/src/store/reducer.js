import { combineReducers } from 'redux'
import { reducer as thunk } from 'redux-saga-thunk'

import uiReducer from './ui/reducer'
import { UI } from './ui/const'
import formReducer from './forms/reducer'
import { FORMS } from './forms/const'
import { AUTH } from './auth/const'
import authReducer from './auth/reducers'

const reducers = {
  [UI]: uiReducer,
  [FORMS]: formReducer,
  [AUTH]: authReducer,
  thunk,
}

const reducer = combineReducers(reducers)

export default reducer
