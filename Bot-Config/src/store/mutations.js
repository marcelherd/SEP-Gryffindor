import * as types from './mutation-types'

export default {
  [types.SET_SELECTED] (state, selection) {
    state.selected = selection
  },
  [types.UPDATE_TREE] (state, tree) {
    state.tree = tree
  },
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
