<template>
  <div id="app" class="container">
    <div class="page-sidebar">
      Sidebar here
    </div>

    <transition name="md-router" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style src="vue-material/dist/vue-material.css"></style>

<style>
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}

.container {
  height: 100%;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-box;
  display: box;

  -ms-flex-direction: row;
  flex-direction: row;

  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  -ms-box-orient: horizontal;
  box-orient: horizontal;
}

.page-sidebar {
  background: hotpink;
  width: 200px;

  -ms-flex: 0 100px;
  flex: 0 100px;

  -webkit-box-flex: 0;
  -moz-box-flex: 0;
  -ms-box-flex: 0;
  box-flex: 0;
}

.page-content {
  -ms-flex: 1;
  flex: 1;

  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -ms-box-flex: 1;
  box-flex: 1;
}

#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
