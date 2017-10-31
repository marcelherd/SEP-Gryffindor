import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: 'indigo',
  accent: 'pink',
  warn: 'deep-orange',
  background: 'white'
})

Vue.material.registerTheme('sidebar', {
  primary: 'orange'
})
