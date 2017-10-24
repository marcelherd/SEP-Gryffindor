import * as types from './mutation-types'

export default {
  [types.ADD_BOT] (state, bot) {
    state.bots.push(bot)
  },
  [types.REMOVE_BOT] (state, index) {
    state.bots.splice(index, 1)
  },
  [types.TOGGLE_BOT_STATE] (state, index) {
    let bot = state.bots[index]
    bot.state = (bot.state === 'running' ? 'not running' : 'running')
  }
}
