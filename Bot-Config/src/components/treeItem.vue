
<template> <tree-item>
  <tree-item v-for="child in children" :node="child"></tree-item>
</tree-item></template>

<script>
export default {
  name: 'tree-item',
  props: ['child']

}
</script>

<style>

</style>

