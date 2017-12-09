import { INFO, ERROR, SUCCESS } from './const'

export const ADD_TOAST = 'ADD_TOAST'
export const REMOVE_TOAST = 'REMOVE_TOAST'
export const BEGIN_LOADING = 'BEGIN_LOADING'
export const FINISH_LOADING = 'FINISH_LOADING'
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
export const INIT_PAGES_UI = 'INIT_PAGES_UI'
export const SET_PAGE_UI_PROP = 'SET_PAGE_UI_PROP'
export const SET_SECOND_TOOLBAR_VISIBLE = 'SET_SECOND_TOOLBAR_VISIBLE'
export const SHOW_DIALOG = 'SHOW_DIALOG'
export const HIDE_DIALOG = 'HIDE_DIALOG'


export const addInfoToast = text => ({ type: ADD_TOAST, payload: { text, type: INFO } })
export const addErrorToast = text => ({ type: ADD_TOAST, payload: { text, type: ERROR } })
export const addServerErrorToast = () => addErrorToast('Ошибка сервера. Попробуйте позже.')
export const addSuccessToast = text => ({ type: ADD_TOAST, payload: { text, type: SUCCESS } })
export const removeToast = () => ({ type: REMOVE_TOAST })
export const toggleDrawer = () => ({ type: TOGGLE_DRAWER })

export const beginLoading = () => ({ type: BEGIN_LOADING })
export const finishLoading = () => ({ type: FINISH_LOADING })

export const showDialog = (name, data = null) => ({ type: SHOW_DIALOG, payload: { name, data } })
export const hideDialog = name => ({ type: HIDE_DIALOG, payload: { name } })

