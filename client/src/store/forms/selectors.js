import isPlainObject from 'lodash/isPlainObject'

import * as c from './const'
import { getFormState } from './utils'


export const INITIAL_FORM_DATA = {

}

const selectFormsState = state => state[c.FORMS] || {}

export const selectFormState = (state, formName) => {
  const formState = selectFormsState(state)[formName] || null
  //console.log(`selectFormState ${formName}: `, formState)
  if (formState === null && INITIAL_FORM_DATA[formName] !== undefined) {
    //console.log(`get initial: `, INITIAL_FORM_DATA[formName](state))
    return INITIAL_FORM_DATA[formName](state)
  }
  return formState || getFormState(0, {})
}
