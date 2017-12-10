import { fork, takeEvery, put, select } from 'redux-saga/effects'


import * as a from './actions'
import { INITIAL_FORM_DATA } from './selectors'

function* resetForm(action) {
  if (action.payload.initial && INITIAL_FORM_DATA[action.payload.formName]) {
    const data = yield select(INITIAL_FORM_DATA[action.payload.formName])
    //console.log('Reset form to: ', data.data)
    yield put(a.setFormData(action.payload.formName, data.data))
  } else {
    yield put(a.setFormData(action.payload.formName, {}))
  }
}

function* watchFormReset() {
  yield takeEvery(a.RESET_FORM_DATA, resetForm)
}

export default function* () {
  yield fork(watchFormReset)
}
