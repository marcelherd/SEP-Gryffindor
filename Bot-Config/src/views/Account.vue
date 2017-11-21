<template>
  <bt-page-container pageTitle="Account details">
    <md-layout md-column>
      <div class="bt-form">
        <div class="bt-form-section">
          <div class="bt-form-section-header">Bot configuration</div>
          <input type="text" placeholder="Brand ID for production" class="bt-input">
          <input type="text" placeholder="Brand ID for staging" class="bt-input">
        </div>
      </div>
      <md-layout md-align="end">
        <button @click="save" class="bt-button">Save</button>
      </md-layout>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'

export default {
  name: 'overview',
  components: {
    'bt-page-container': PageContainer
  },
  data () {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
