/**
 * The vuex actions.
 *
 * @author Marcel Herd
 * @module store/actions
 */

import * as types from './mutation-types'

import RuntimeService from '@/services/RuntimeService'

/**
 * Attempts to login with the given credentials.
 * If it succeeds, it saves the token and user information in local storage.
 *
 * @param {Credentials} credentials - the credentials to authenticate with
 * @return {Promise} - a promise containing the response.
 */
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

/**
 * Logs the user out.
 * Removes token and user information from local storage.
 *
 * @return {Promise}
 */
export const logout = ({ commit }) => {
  return new Promise((resolve) => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit(types.LOGOUT)
    resolve()
  })
}

/**
 * Fetches new user information and updates the local storage accordingly.
 *
 * @param {string} userId - the id of the user
 * @return {Promise} - a promise containing the response
 */
export const updateUser = ({ commit }, userId) => {
  return RuntimeService.findUserById(userId)
    .then((data) => {
      commit(types.UPDATE_USER, data)
      localStorage.setItem('user', JSON.stringify(data))
    })
}
