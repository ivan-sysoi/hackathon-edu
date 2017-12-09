import { fork } from 'redux-saga/effects'

import formsSaga from './forms/sagas'

export default function* (services = {}) {
  yield fork(formsSaga, services)
}
