<template>
  <md-layout :md-align="align ? align : 'end'">
    <button @click="handleClick" class="bt-button" :class="`bt-button-${theme}`">
      <slot />
    </button>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-button',
  props: ['theme', 'align'],
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style>
.bt-button {
  height: 30px;
  padding: 0 8px 0 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;
  color: #ABABAB;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1px;
}

.bt-button:hover,
.bt-button:focus {
  text-decoration: none;
  color: #4C4C4C;
}

.bt-button.bt-button-orange {
  color: #FF8729;
}

.bt-button.bt-button-orange:hover,
.bt-button.bt-button-orange:focus {
  color: white;
  background-color: #FF8729;
}

.bt-button.bt-button-yellow {
  color: #FFD244;
}

.bt-button.bt-button-yellow:hover,
.bt-button.bt-button-yellow:focus {
  color: #FF7544;
}

.bt-button.bt-button-blue {
  color: #80CFB8;
}

.bt-button.bt-button-blue:hover,
.bt-button.bt-button-blue:focus {
  color: white;
  background-color: #80CFB8;
}
</style>
