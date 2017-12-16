/**
 * The vuex store.
 *
 * @author Marcel Herd
 * @module store/index
 */

import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  loggedIn: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user'))
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
