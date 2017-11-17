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

  let url = `http://141.19.145.163:3000/api/v1/authenticate`

  let payload = JSON.stringify(credentials)

  let headers = new Headers({ 'Content-Type': 'application/json' })
  let request = new Request(url, {
    method: 'POST',
    mode: 'cors',
    headers: headers,
    body: payload
  })

  return fetch(request)
    .then(response => response.json())
    .then((data) => {
      if (data.success) {
        commit(types.LOGIN_SUCCESS)
        localStorage.setItem('token', data.token)
      } else {
        throw new Error(data.message)
      }
    })
}

export const logout = ({ commit }) => {
  return new Promise((resolve) => {
    localStorage.removeItem('token')
    commit(types.LOGOUT)
    resolve()
  })
}
