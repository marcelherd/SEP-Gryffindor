// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import KonamiCode from 'vue-konami-code'

import App from './App'
import router from './router'
import store from './store'
import i18n from './i18n'

import './config'

Vue.config.productionTip = false

Vue.use(KonamiCode, {callback: function () {
  const audio = new Audio('/static/christmas.mp3')
  audio.play()
}})

console.log(`↑ ↑ ↓ ↓ ← → ← → B A`)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
