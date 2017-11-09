
<template>
  <div class="treeItem">
    <p  v-bind:class ="{selected: isActive}" @click.stop="select(node.data)">{{ node.data }}</p>
    <tree-item  @clicked="select" @click.stop="select(node.data)" :key ="child.data" v-for="child in node.children" :node="child" >
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
    // emits event that makes paragraphs in parent selectable(clickable)
    // means that children in tree are added to the right node cause they are added to selected node
    select (element) {
      this.$emit('clicked', element)
      this.isActive = !this.isActive
    }
  }

}
</script>

<style>
.treeItem  { padding-left: 8px; }
.selected {font-weight:bold;}
</style>

