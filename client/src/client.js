import 'react-hot-loader/patch'
import 'babel-polyfill'
import React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { ServerStateProvider } from 'react-router-server'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

import { basename, isDev } from 'config'
import configureStore from 'store/configure'
import history from 'services/history'

import App from 'components/App'

const serverState = window.__SERVER_STATE__
const initialState = window.__INITIAL_STATE__

const store = configureStore(initialState)

const renderApp = () => (
  <ServerStateProvider state={serverState}>
    <Provider store={store}>
      <Router basename={basename} history={history}>
        <App />
      </Router>
    </Provider>
  </ServerStateProvider>
)

const root = document.getElementById('app')
hydrate(renderApp(), root)

if (!isDev) {
  OfflinePluginRuntime.install()
}

if (module.hot) {
  module.hot.accept('components/App', () => {
    require('components/App')
    render(renderApp(), root)
  })
}
