<template>
  <div class="bt-tree-node">
    <div class="bt-node-input-container">
      <input type="text" placeholder="Answer" readonly="true" ref="input"
        v-model="node.data" @dblclick="handleDblclick($event)"
        @blur="handleBlur($event)" @keyup.enter="handleBlur($event)"></input>
    </div>
    <button @click="addChild">+</button>
    <div class="bt-node-children">
      <bt-tree-node :node="child" v-for="(child, index) in node.children" :key="index" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'bt-tree-node',
  props: ['node', 'isRoot'],
  mounted () {
    if (!this.isRoot) {
      const dblClickEvent = new Event('dblclick')
      this.$refs.input.dispatchEvent(dblClickEvent)
      this.$refs.input.focus()
    }
  },
  methods: {
    addChild () {
      this.node.children.push({
        data: '',
        children: []
      })
    },

    handleDblclick ($event) {
      if (!this.isRoot) {
        $event.target.readOnly = ''
      }
    },

    handleBlur ($event) {
      $event.target.readOnly = 'true'
    }
  }
}
</script>

<style>
.bt-tree-node {
  display: inline-flex;
  flex-wrap: wrap;
}

.bt-node-input-container {
  border: 1px solid #101929;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  outline: 0;
}

.bt-node-input-container input {
  margin: 8px;
  padding: 8px;
  padding-right: 0;
  font-size: 16px;
}

.bt-node-input-container input:read-only {
  border: 0;
}

.bt-node-input-container input:not(read-only) {
  border: 0;
  border-bottom: 1px dashed #101929;
  outline: 0;
}

.bt-tree-node button {
  min-width: 50px;
  padding: 8px;
  border: 0;
  background-color: #101929;
  color: white;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  font-size: 24px;
}

.bt-tree-node button:hover {
  cursor: pointer;
  background-color: #FAD232;
  color: black;
}

.bt-tree-node .bt-tree-node {
  margin-top: 10px;
  margin-left: 20px;
}
</style>