<template>
  <div class="treeItem">
    <p  v-bind:class ="{selected: this.$store.state.selected.id === node.id}" @click="select(node.id)" >{{ node.data }}</p>
    <tree-item  @click="select(node.id)" :key ="child.id" v-for="child in node.children" :node="child" >
    </tree-item>
  </div>

</template>

<script>
/**
 * This component realizes the treeItems(nodes) for the Tree component
 *
 * @module components/TreeItem
 */

export default {
  name: 'tree-item',
/**
 * @typedef {Object} node - the Node that will be iterated over
 */
  props: ['node'],
  methods: {
/**
 * Sets the node that was clicked on as the selected property in store
 *
 * @param {number} id - The unique id of the node that was clicked on
*/
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

