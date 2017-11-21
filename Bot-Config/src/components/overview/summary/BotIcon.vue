<template>
  <md-layout md-flex md-align="center" md-vertical-align="center">
    <div :class="`bt-bot-icon ${bot.running ? 'bt-bot-active' : 'bt-bot-inactive'}`">
      <span>{{ face }}</span>
    </div>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-bot-icon',
  props: ['bot'],
  data () {
    return {
      face: ''
    }
  },
  created () {
    const eyes = [':', ';', 'x']
    const mouths = [')', ']', '3', '>']

    const eye = eyes[Math.floor(Math.random() * eyes.length)]
    const mouth = mouths[Math.floor(Math.random() * mouths.length)]

    this.face = eye + mouth
  }
}
</script>

<style>
.bt-bot-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 48px;
  background-color: #FAD232;
  background-color: white;
}

.bt-bot-icon span {
  font-size: 18px;
  font-weight: 700;
}

.bt-bot-icon.bt-bot-active {
  box-shadow: rgb(116, 206, 183) 0px 0px 10px 4px;
}

.bt-bot-icon.bt-bot-inactive {
  border: 3px solid #757575;
}
</style>
