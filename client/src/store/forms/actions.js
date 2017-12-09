export const SET_FORM_DATA = 'SET_FORM_DATA'
export const RESET_FORM_DATA = 'RESET_FORM_DATA'

export const setFormData = (formName, data) => ({ type: SET_FORM_DATA, payload: { data, formName } })
export const resetFormData = (formName, initial = true) => ({ type: RESET_FORM_DATA, payload: { formName, initial } })
