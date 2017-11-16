<template>
  <div>
    <app-sidebar ref="mainSidebar"></app-sidebar>

    <md-toolbar>
      <md-button class="md-icon-button">
        <img src="/static/favicon.png">
      </md-button>

      <h2 class="md-title with-buttons">{{ pageTitle }}</h2>

      <md-button @click="logout">Logout</md-button>
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
