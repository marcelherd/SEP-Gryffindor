import * as types from './mutation-types'

export default {
  [types.SET_SELECTED] (state, selection) {
    state.selected = selection
  },
  [types.UPDATE_TREE] (state, tree) {
    state.tree = tree
  },
  [types.SET_TEMPLATE] (state, template) {
    state.template = template
  }
}
