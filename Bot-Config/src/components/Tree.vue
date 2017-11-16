<template>
  <div>
    <md-input-container md-clearable>
      <label>Option</label>
      <md-input v-model="option"></md-input>
    </md-input-container>
    <md-button class="md-raised" @click="add">Add option </md-button>
    <md-button class="md-raised" @click="deleteNode">Delete option </md-button>
    <div class= "tree">
      <div v-bind:class ="{selected: this.$store.state.selected === tree.root}" @click="select(tree.root.id)" v-if = "tree.root.data !== null">{{tree.root.data}} </div>
      <tree-item :key = "child.id" v-for = "child in tree.root.children" :node="child">
      </tree-item>
    </div>

  </div>
</template>

<script>
/**
 * This component realizes the tree
 *
 * @module components/Tree.vue
 */

import TreeItem from '@/components/TreeItem'
import Tree from '@/model/tree.js'
import Node from '@/model/treenode.js'

export default {
  name: 'app-tree',
  components: {
    'tree-item': TreeItem
  },
  created () {
    this.tree.root = new Node('Options')
    this.$store.dispatch('setSelected', this.tree.root)
  },
  data () {
    return {
      option: 'none',
      tree: new Tree()
    }
  },
  methods: {
    /**
    * Adds a node to the tree at selected node
    */
    add () {
      this.tree.add(this.option, this.$store.state.selected.id)
      this.giveTreeToParent()
    },
    /**
    * Removes selected node
    */
    deleteNode () {
      this.tree.remove(this.$store.state.selected.id)
    },
    /**
    * Saves tree in store so it can accessed in parent component(Create.vue)
    */
    giveTreeToParent () {
      this.$store.dispatch('updateTree', this.tree)
    },
    /**
    * Saves tree in store so it can accessed in parent component(Create.vue)
    * @param {number} nodeId - The unique id of the node that was clicked on
    */
    select (nodeID) {
      this.$store.dispatch('setSelected', this.tree.root)
    }
  }
}
</script>

<style>
.selected  { font-weight:bold; }
</style>
