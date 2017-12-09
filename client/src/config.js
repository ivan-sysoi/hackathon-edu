const isBrowser = typeof window !== 'undefined'
const isServer = typeof window === 'undefined'
const isDev = process.env.NODE_ENV !== 'production'
const env = process.env.NODE_ENV || 'development'
const basename = ''
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080
const requestOptionsKey = 'o'
const api = 'http://deav-api.local/api/v1/'

if (isDev) {
  //jwtExpiryTime = 60
  //jwtRefreshTimeout = 30 * 1000
}

module.exports = {
  isBrowser,
  isServer,
  isDev,
  env,
  basename,
  host,
  port,
  api,
  requestOptionsKey,
}
