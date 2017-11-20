<template>
  <div>
    <app-sidebar ref="mainSidebar"></app-sidebar>

    <md-toolbar>
      <router-link to="/Overview" exact tag="md-button" class="md-icon-button">
        <img src="/static/favicon.png">
      </router-link>

      <h2 class="md-title with-buttons">{{ pageTitle }}</h2>

      <md-menu md-align-trigger md-direction="bottom left">
        <md-button md-menu-trigger>{{ user.username }} &#9660;</md-button>

        <md-menu-content>
          <md-menu-item v-if="user.admin" @click="$router.push('Administration')">Administration</md-menu-item>
          <md-menu-item @click="logout">Log out</md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>

    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/layout/Sidebar'

/**
 * A wrapper component for other components.
 * It adds a sidebar and a page header.
 *
 * @module components/layout/PageContent
 * @param {string} pageTitle - Required, adjusts the title that is displayed in the page header
 */
export default {
  name: 'PageContent',
  props: ['pageTitle'],
  components: {
    'app-sidebar': Sidebar
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {

    /**
     * Shows/hides the navigation sidebar
     */
    toggleSidenav () {
      this.$refs.mainSidebar.toggleSidenav()
    },

    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ name: 'Login' })
      })
    }

  }
}
</script>

<style>
.page-content {
  padding: 16px;
}

.with-buttons {
  flex: 1;
}
img {
  width: 100%;
  height: 100%;
}
</style>
