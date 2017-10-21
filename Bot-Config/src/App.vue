<template>
  <div id="app" class="container">
    <md-whiteframe class="page-sidebar">
      <md-list>
        <md-list-item>
          <h2>Botwarts</h2>
          <md-divider></md-divider>
        </md-list-item>
        <md-list-item>
            <router-link to="/overview">Overview</router-link>
        </md-list-item>
        <md-list-item>
            <router-link to="/create">Create bot</router-link>
        </md-list-item>
      </md-list>
    </md-whiteframe>

    <transition name="md-router" appear>
      <div class="page-content">
        <router-view></router-view>
      </div>
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

.main-content {
  padding: 16px;
}

#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
