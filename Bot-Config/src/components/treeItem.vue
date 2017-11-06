
<template>
  <div>
    <tree-item  :key ="child" v-for="child in children" :node="child"></tree-item>
    <div @click="select(node.data)">{{node.data}} </div>
  </div>

</template>

<script>
export default {
  name: 'tree-item',
  props: ['node'],
  methods: {
    select (data) {
      console.log(data)
      this.$emit('clicked', data)
    }
  }

}
</script>

<style>

</style>

