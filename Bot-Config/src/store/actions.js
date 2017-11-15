import * as types from './mutation-types'

export const updateTree = ({ commit }, tree) => {
  commit(types.UPDATE_TREE, tree)
}

export const setSelected = ({ commit }, selection) => {
  commit(types.SET_SELECTED, selection)
}

export const setTemplate = ({ commit }, template) => {
  commit(types.SET_TEMPLATE, template)
}

export const login = ({ commit }, credentials) => {
  commit(types.LOGIN)

  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('token', 'JWT')
      commit(types.LOGIN_SUCCESS)
      resolve()
    }, 10)
  })
}

export const logout = ({ commit }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('token')
      commit(types.LOGOUT)
      resolve()
    }, 10)
  })
}
