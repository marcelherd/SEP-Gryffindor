
<template>
  <div class="treeItem">
    <p  v-bind:class ="{selected: isActive}" @click="select(node.data)" >{{ node.data }}</p>
    <tree-item  @click="select(node.data)" :key ="child.data" v-for="child in node.children" :node="child" >
    </tree-item>
  </div>

</template>

<script>
export default {
  name: 'tree-item',
 // node that will be iterated over
  props: ['node'],
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    // Ensures that children in tree are added to the right node cause they are added to selected node
    select (element) {
      this.$store.dispatch('setSelected', element ? this.$store.state.tree.findBFS(element) : null)
      this.isActive = !this.isActive
    }
  }

}
</script>

<style>
.treeItem  { padding-left: 8px; }
.selected  { font-weight:bold; }
</style>

