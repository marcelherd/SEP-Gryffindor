/**
 * ↑ ↑ ↓ ↓ ← → ← → B A
 *
 * @author Marcel Herd
 * @module easteregg
 */

import Vue from 'vue'
import KonamiCode from 'vue-konami-code'

Vue.use(KonamiCode, { callback: () => {
  const audio = new Audio('/static/christmas.mp3')
  audio.play()
}})

console.log(`↑ ↑ ↓ ↓ ← → ← → B A`)
