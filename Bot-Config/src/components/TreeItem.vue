
<template>
  <div class="treeItem">
    <p  v-bind:class ="{selected: this.$store.state.selected.id === node.id}" @click="select(node.id)" >{{ node.data }}</p>
    <tree-item  @click="select(node.id)" :key ="child.id" v-for="child in node.children" :node="child" >
    </tree-item>
  </div>

</template>

<script>
export default {
  name: 'tree-item',
 // node that will be iterated over
  props: ['node'],
  methods: {
    // Ensures that children in tree are added to the right node cause they are added to selected node
    select (id) {
      this.$store.dispatch('setSelected', id ? this.$store.state.tree.findBFS(id) : null)
    }
  }

}
</script>

<style>
.treeItem  { padding-left: 8px; }
.selected  { font-weight:bold; }
</style>

