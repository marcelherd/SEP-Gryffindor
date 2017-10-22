import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  bots: [
    {
      'brandID': 123123123,
      'username': 'Anon',
      'password': 'pw'
    },
    {
      'brandID': 123123123,
      'username': 'Anon',
      'password': 'pw'
    },
    {
      'brandID': 123123123,
      'username': 'Anon',
      'password': 'pw'
    },
    {
      'brandID': 123123123,
      'username': 'Anon',
      'password': 'pw'
    },
    {
      'brandID': 123123123,
      'username': 'Anon',
      'password': 'pw'
    }
  ]
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
