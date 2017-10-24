import * as types from './mutation-types'

export const addBot = ({ commit }, bot) => {
  commit(types.ADD_BOT, bot)
}

export const removeBot = ({ commit }, index) => {
  commit(types.REMOVE_BOT, index)
}

export const toggleBotState = ({ commit }, index) => {
  commit(types.TOGGLE_BOT_STATE, index)
}
