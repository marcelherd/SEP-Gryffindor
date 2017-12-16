import * as types from './mutation-types'

import RuntimeService from '@/services/RuntimeService'

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

export const updateUser = ({ commit }, userId) => {
  return RuntimeService.findUserById(userId)
    .then((data) => {
      commit(types.UPDATE_USER, data)
      localStorage.setItem('user', JSON.stringify(data))
    })
}
