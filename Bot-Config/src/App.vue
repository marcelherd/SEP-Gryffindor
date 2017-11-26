<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
/**
 * The bot platform root component.
 */
export default {
  name: 'app'
}
</script>

<style src="vue-material/dist/vue-material.css"></style>

<style>
body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: 'Open Sans', sans-serif;
}

.bt-header-1 {
  font-size: 48px;
  font-weight: 500;
  color: #FFD244;
  margin-bottom: 48px;
}
</style>
