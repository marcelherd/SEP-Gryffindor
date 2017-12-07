<template>
  <button @click="onClick" class="bt-fab" :style="style">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'bt-fab',
  props: ['to'],
  data () {
    return {
      style: {}
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    onClick () {
      if (this.to) {
        this.$router.push(this.to)
      }
    },
    handleResize () {
      const body = document.body
      const html = document.documentElement

      const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

      this.style = {
        top: `calc(${height - 156}px - 5%)`
      }
    }
  }
}
</script>

<style>
.bt-fab {
  position: absolute;
  bottom: calc(100px + 5%);
  right: 5%;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 0;
  border-radius: 56px;
  box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
  background-color: #FAD232;
  background-clip: padding-box;
}

.bt-fab:hover {
  cursor: pointer;
}
</style>
