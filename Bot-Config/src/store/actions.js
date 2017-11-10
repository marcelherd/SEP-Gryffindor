import * as types from './mutation-types'
export const updateTree = ({ commit }, tree) => {
  commit(types.UPDATE_TREE, tree)
}
export const setSelected = ({ commit }, selection) => {
  commit(types.SET_SELECTED, selection)
}
