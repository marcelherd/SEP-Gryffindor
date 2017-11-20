<template>
  <md-layout md-align="center"
    :class="`bt-page-content ${$store.getters.user ? '' : 'bt-auto-height'}`">
    <md-layout md-flex="50" md-flex-small="100">
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
  margin-top: 48px;
  margin-bottom: 48px;
}

.bt-auto-height {
  align-items: flex-start;
}
</style>
