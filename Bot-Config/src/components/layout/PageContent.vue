<template>
  <md-layout class="bt-page-content">
    <md-layout md-flex-offset="25" md-flex="50"
      md-flex-offset-large="15" md-flex-large="70"
      md-flex-offset-small="5" md-flex-small="90">
      <slot />
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'bt-page-content'
}
</script>

<style>
.bt-page-content {
  align-items: flex-start;
  margin-top: 48px;
  margin-bottom: 48px;
}
</style>
