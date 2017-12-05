<template>
  <md-layout md-flex-offset="15" class="bt-page-content">
    <md-layout md-flex="50" md-flex-large="85" md-flex-small="90">
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
