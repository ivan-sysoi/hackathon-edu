import React from 'react'
import serialize from 'serialize-javascript'
import { renderToStaticMarkup } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-router-server'

import App from 'components/App'
import Html from 'components/Html'
import ErrorPage from 'components/pages/ErrorPage'
import { basename } from 'config'


export const renderApp = ({ store, context, location }) => {
  const app = (
    <Provider store={store}>
      <StaticRouter basename={basename} context={context} location={location}>
        <App />
      </StaticRouter>
    </Provider>
  )

  return renderToString(app)
}

export const render500 = () => {
  return renderToStaticMarkup(<ErrorPage />)
}

export const renderHtml = ({ serverState, initialState, content, staticPage }) => {
  let assets = { css: [], js: [] }
  if (!staticPage) {
    assets = global.assets
  }
  const state = `
    window.__SERVER_STATE__ = ${serialize(serverState)};
    window.__INITIAL_STATE__ = ${serialize(initialState)};
  `
  const html = renderToStaticMarkup(<Html state={state} content={content} assets={assets} />)
  return `<!doctype html>\n${html}`
}
