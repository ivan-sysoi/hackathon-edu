/* eslint-disable no-console */
import 'babel-polyfill'

import app from 'server-app'
import { port, host, basename, isDev } from 'config'

app.listen(port, (error) => {
  const boldBlue = text => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`
  if (error) {
    console.error(error)
  } else {
    console.info(`Server is running at ${boldBlue(`http://${host}:${port}${basename}/${isDev ? ' in dev mode' : ' in production mode'}`)}`)
  }
})
