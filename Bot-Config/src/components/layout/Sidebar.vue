<template>
  <md-sidenav class="main-sidebar md-left md-fixed" md-swipeable ref="mainSidebar">
    <md-toolbar class="app-logo md-large">
      <router-link exact to="/">
        <!--
        <img src="http://via.placeholder.com/200x150" alt="App Logo">
        -->
        <img src="/static/logo_white_cut.png" alt="App Logo">
      </router-link>
    </md-toolbar>

    <div class="main-sidebar-links">
      <md-list>
        <md-list-item>
          <router-link exact to="/overview">Overview</router-link>
        </md-list-item>
        </md-list>
    </div>
  </md-sidenav>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    toggleSidenav () {
      this.$refs.mainSidebar.toggle()
    }
  }
}
</script>

<style scoped>
.main-sidebar .app-logo {
  min-height: 172px;
}

.main-sidebar .app-logo a {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.main-sidebar .app-logo img {
  width: 160px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.main-sidebar-links .md-list {
  padding: 0;
}

.main-sidebar-links .md-list .md-list-item .md-list-item-container {
  font-weight: 500;
}
</style>
