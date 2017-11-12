<template>
  <div>
    <app-sidebar ref="mainSidebar"></app-sidebar>

    <md-toolbar>
      <md-button class="md-icon-button" @click="toggleSidenav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">{{ pageTitle }}</h2>
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
    }

  }
}
</script>

<style>
.page-content {
  padding: 16px;
}
</style>
