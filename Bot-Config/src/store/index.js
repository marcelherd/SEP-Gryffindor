import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  bots: [
    {
      'brandID': 85041411,
      'username': 'welcome-agent',
      'password': 'pw',
      'type': 'Welcome Bot',
      'state': 'running'
    },
    {
      'brandID': 85041112,
      'username': 'faq-agent',
      'password': 'pw',
      'type': 'FAQ Bot',
      'state': 'not running'
    }
  ]
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
