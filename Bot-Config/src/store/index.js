import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)
// saves the app's state
const state = {
  tree: null,
  selected: null,
  template: null

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
