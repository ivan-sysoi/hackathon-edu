import { isBrowser } from 'config'


let createHistory
if (isBrowser) {
  createHistory = require('history/createBrowserHistory').default
} else {
  createHistory = require('history/createMemoryHistory').default
}

const history = createHistory()

export default history
