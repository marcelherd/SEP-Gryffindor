
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
  props: ['node'],
  data () {
    return {
      isActive: false
    }
  },
  methods: {
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

