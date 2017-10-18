<template>
  <div id="app">
    <sidebar></sidebar>
    <router-view/>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'

export default {
  name: 'app',
  components: {
    'sidebar': Sidebar
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
