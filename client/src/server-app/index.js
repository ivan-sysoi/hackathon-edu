import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import configureStore from 'store/configure'

import { getInitialStoreData } from './utils'
import { renderApp, renderHtml, render500 } from './render'


const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.get('/favicon.ico', (req, res) => { // FIXME
  res.status(204)
})

app.get('/robots.txt', (req, res) => { // FIXME
  res.status(204)
})

app.use((req, res, next) => {
  getInitialStoreData(req, res).then((initialData) => {
    //console.log('initialData: ', initialData)
    const context = {}
    const store = configureStore(initialData, req)
    renderApp({ store, context, location: req.url })
      .then(({ state: serverState, html: content }) => {
        if (context.status) {
          res.status(context.status)
        }
        if (context.url) {
          res.redirect(context.url)
        } else {
          const initialState = store.getState()
          res.send(renderHtml({ serverState, initialState, content, staticPage: false }))
        }
      })
      .catch(next)
  }).catch(next)
})

app.use((err, req, res, next) => {
  //console.log('express 500 route', err, req.url)
  res.status(500).send(renderHtml({ content: render500(), staticPage: true }))
  next(err)
})


export default app
