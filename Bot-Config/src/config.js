import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: {
    color: 'blue-grey',
    hue: '900'
  },
  accent: {
    color: 'yellow',
    hue: '700',
    textColor: 'black'
  },
  warn: {
    color: 'green',
    hue: '900'
  },
  background: 'white'
})
