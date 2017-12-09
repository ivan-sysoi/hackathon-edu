import { fetchState } from 'react-router-server'
//import isNumber from 'lodash/isNumber'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'

//import { isServer } from 'config'


export const fetchAppState = fetchState(
  state => ({
    hasServerState: !!state.data,
  }),
  actions => ({
    setServerState: data => actions.done({ data }),
    cleanServerState: () => actions.done(),
  })
)

/**
 * Converts query str to object
 * @param qstr
 * @returns {{}}
 */
//export const parseQuery = (qstr) => {
//  const query = {}
//  let a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&')
//  for (let i = 0; i < a.length; i++) {
//    let b = a[i].split('=')
//    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
//  }
//  return query
//}

export const jsonToFormData = (json) => {
  const formData = new FormData()

  const fillWithValue = (key, val) => {
    if (val !== undefined && val !== null) {
      if (isArray(val)) {
        fillWithArray(key, val)
      } else if (val instanceof File) {
        formData.append(key, val)
      } else if (isObject(val)) {
        fillWithDict(key, val)
      } else {
        formData.append(key, val)
      }
    }
  }

  const fillWithDict = (key, val) => {
    Object.keys(val).forEach((valKey) => {
      fillWithValue(`${key}-${valKey}`, val[valKey])
    })
  }

  const fillWithArray = (key, val) => {
    val.forEach((itemValue, ind) => {
      fillWithValue(`${key}-${ind}`, itemValue)
    })
    formData.append(`${key}_count`, val.length)
  }

  Object.keys(json).forEach((key) => {
    fillWithValue(key, json[key])
  })

  //console.log('formData: ', formData)
  //formData.forEach((v, k) => {
  //  console.log(k, v)
  //})

  return formData
}

export const gethumanTime = (timeDelta) => {
  if (timeDelta > 60) {
    if (timeDelta > 3600) {
      return `${timeDelta / 3600} hours`
    }
    return `${timeDelta / 60} min`
  }
  return `${timeDelta} sec`
}

export const compareArrays = (array1 = [], array2 = []) => {
  if (!isArray(array1) || !isArray(array2)) {
    return true
  }
  if (array1.length !== array2.length) {
    return true
  }
  return array1.some((val, ind) => {
    return val !== array2[ind]
  })
}

export const compareObjects = (obj1 = {}, obj2 = {}) => {
  const undefinedToNull = (val) => {
    if (val === undefined) {
      return null
    }
    return val
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return true
  }
  let changed = false;
  return Object.keys(obj1).some((key) => {

    const obj1Val = undefinedToNull(obj1[key])
    const obj2Val = undefinedToNull(obj2[key])
    if ((obj1Val === null && obj2Val !== null) || (obj1Val !== null && obj2Val === null)) {
      return true
    }
    if (isArray(obj1Val) && isArray(obj2Val)) {
      changed = compareArrays(obj1Val, obj2Val)
    } else if (isObject(obj1Val) && isObject(obj2Val)) {
      changed = compareObjects(obj1Val, obj2Val)
    } else {
      changed = obj1Val !== obj2Val
    }
    //if (changed) {
    //  console.log('Diff ' + key, obj1Val, obj2Val)
    //}
    return changed
  })
}

export const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

//export const getUniqueId = () => {
//  if (isServer) {
//    const t = process.hrtime()
//    return parseFloat(`${t[0]}.${t[1]}`)
//  }
//  return performance.now()
//}
