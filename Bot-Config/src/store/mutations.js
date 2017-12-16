/**
 * The vuex mutations.
 *
 * @author Marcel Herd
 * @module store/mutations
 */

import * as types from './mutation-types'

export default {
  [types.LOGIN] (state) {
    state.pending = true
  },
  [types.LOGIN_SUCCESS] (state, user) {
    state.loggedIn = true
    state.user = user
    state.pending = false
  },
  [types.LOGOUT] (state) {
    state.loggedIn = false
    state.user = null
  },
  [types.UPDATE_USER] (state, user) {
    state.user = user
  }
}
