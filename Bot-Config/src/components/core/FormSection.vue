<template>
  <div class="bt-form-section">
    <div class="bt-form-section-header">{{ header }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'bt-form-section',
  props: ['header']
}
</script>

<style>
.bt-form-section {
  margin-top: 20px;
}

.bt-form-section-header {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 5px;
}
</style>
