import { createStore, applyMiddleware, compose } from 'redux'
import { middleware as thunkMiddleware } from 'redux-saga-thunk'
import createSagaMiddleware from 'redux-saga'

import { isDev, isBrowser } from 'config'
import history from 'services/history'
import Cookies from 'services/cookies'
import Api from 'services/api'


import reducer from './reducer'
import sagas from './sagas'



const devtools = isDev && isBrowser && window.devToolsExtension
  ? window.devToolsExtension
  : () => fn => fn

const configureStore = (initialState, req = null) => {
  const services = {
    history,
  }
  if (req !== null) {
    services.api = req.apiServerClient
    //console.log('Got server cookies: ', req.cookies)
    services.cookies = new Cookies(req.cookies)
  } else {
    services.cookies = new Cookies()
    services.api = new Api()
  }


  const sagaMiddleware = createSagaMiddleware()
  const enhancers = [
    applyMiddleware(
      thunkMiddleware,
      sagaMiddleware,
    ),
  ]
  if (isBrowser) {
    enhancers.push(
      devtools(),
    )
  }
  const store = createStore(reducer, initialState, compose(...enhancers))
  let sagaTask = sagaMiddleware.run(sagas, services)

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default
      store.replaceReducer(nextReducer)
    })
    module.hot.accept('./sagas', () => {
      const nextSagas = require('./sagas').default
      sagaTask.cancel()
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas, services)
      })
    })
  }

  return store
}

export default configureStore
