<template>
  <md-layout class="bt-page-container">
    <bt-page-header :pageTitle="pageTitle" />

    <bt-page-content>
      <slot />
    </bt-page-content>

    <bt-page-footer />
  </md-layout>
</template>

<script>
import PageHeader from '@/components/layout/PageHeader'
import PageContent from '@/components/layout/PageContent'
import PageFooter from '@/components/layout/PageFooter'

/**
 * Page container component.
 * Displays its content between a header and a footer.
 *
 * @author Marcel Herd
 * @module components/layout/PageContainer
 *
 * @param {string} pageTitle - the title which is to be displayed in the page header
 */
export default {
  name: 'bt-page-container',
  components: {
    'bt-page-header': PageHeader,
    'bt-page-content': PageContent,
    'bt-page-footer': PageFooter
  },
  props: ['pageTitle']
}
</script>

<style>
.bt-page-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
</style>
