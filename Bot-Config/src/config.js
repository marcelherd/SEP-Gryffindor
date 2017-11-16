import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: {
    color: 'blue-grey',
    hue: '900'
  },
  accent: 'red',
  warn: 'deep-orange',
  background: 'white'
})
