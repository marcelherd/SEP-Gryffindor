<template>
  <page-content page-title="Index">
    <h1>Lorem</h1>
    <p>Ipsum Dolor sit Amet</p>
  </page-content>
</template>

<script>
import PageContent from '@/components/layout/PageContent'

/**
 * This component shows the home page for the bot configuration.
 *
 * @module components/Index
 */
export default {
  name: 'Index',
  components: {
    'page-content': PageContent
  }
}
</script>

<style>
.page-content .md-layout .md-layout {
  margin-bottom: 24px;
}
</style>
