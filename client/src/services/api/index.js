import fetch from 'services/fetch'
import { isServer, api } from 'config'

class Api {
  static headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': 'ru-ru',
  }

  constructor(headers = null) {
    if (api.startsWith('http')) {
      this.apiEndpoint = api
    } else {
      this.apiEndpoint = `${location.protocol}//${location.host}${api}`
    }

    if (headers !== null) {
      this.constructor.headers = Object.assign({}, this.constructor.headers, headers)
    }
  }

  makeUrl(endpoint) {
    let url = endpoint
    if (!url.startsWith('http')) url = `${this.apiEndpoint}/${url}`
    //if (!url.endsWith('/')) url = `${url}/`
    return url
  }

  prepareBody(body) {
    if (!isServer && body instanceof FormData) {
      return body
    } else if (body) {
      return JSON.stringify(body)
    }
    return undefined
  }

  prepareHeaders(customHeaders) {
    const headers = Object.assign({}, this.constructor.headers, customHeaders || {})
    //console.log('prepareHeaders: ', headers, this.constructor.headers)
    Object.keys(headers)
      .filter(k => headers[k] === undefined)
      .forEach((k) => {
        delete headers[k]
      })
    return headers
  }

  request(endpoint, method, body, headers = null) {

    const requestOptions = {
      method,
      body: this.prepareBody(body),
      headers: this.prepareHeaders(headers),
    }

    const url = this.makeUrl(endpoint)
    //console.log(`[REQUEST] ${url}`, requestOptions)

    return new Promise((resolve, reject) => {
      const rejectError = ({ errorData = null, responseStatus = null, message = null }) => {
        //const error = new Error(message)
        //error.errorData = errorData
        //error.responseStatus = responseStatus
        reject({ errorData, responseStatus, message })
      }
      fetch(url, requestOptions)
        .then((response) => {
          if (response.status === 204) {
            resolve(null)
          } else {
            const responseMethod = response.headers.get('Content-Type') === 'text/plain' ? 'text' : 'json'

            response[responseMethod]()
              .then((respData) => {
                //console.log('response json norm', respData)
                if (response.ok) {
                  resolve(respData)
                } else {
                  rejectError({ errorData: respData, responseStatus: response.status })
                }
              })
              .catch((e) => {
                //console.log('response json error', e)
                rejectError({ message: e, responseStatus: response.status })
              })


          }
        })
        .catch((e) => {
          //console.error(`[REQUEST ERROR] ${e}`, e)
          rejectError({ message: e })
        })
    })
  }

  read(endpoint, headers = null) {
    return this.request(endpoint, 'GET', null, headers)
  }

  delete(endpoint, headers = null) {
    return this.request(endpoint, 'DELETE', null, headers)
  }

  create(endpoint, data, headers = null) {
    //console.log('create: ', endpoint, data, headers)
    return this.request(endpoint, 'POST', data, headers)
  }

  update(endpoint, data, headers = null) {
    return this.request(endpoint, 'PUT', data, headers)
  }

  partialUpdate(endpoint, data, headers = null) {
    return this.request(endpoint, 'PATCH', data, headers)
  }

}

export default Api
