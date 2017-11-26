import * as types from './mutation-types'

import RuntimeService from '@/services/RuntimeService'

export const updateTree = ({ commit }, tree) => {
  commit(types.UPDATE_TREE, tree)
}

export const setSelected = ({ commit }, selection) => {
  commit(types.SET_SELECTED, selection)
}

export const login = ({ commit }, credentials) => {
  commit(types.LOGIN)

  return RuntimeService.authenticate(credentials)
    .then((data) => {
      if (data.success) {
        commit(types.LOGIN_SUCCESS, data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        throw new Error(data.message)
      }
    })
}

export const logout = ({ commit }) => {
  return new Promise((resolve) => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit(types.LOGOUT)
    resolve()
  })
}
