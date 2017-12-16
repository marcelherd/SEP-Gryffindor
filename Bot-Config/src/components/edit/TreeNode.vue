<template>
  <div class="bt-tree-node">
    <div class="bt-node-input-container" v-if="isRoot">
      <input type="text" placeholder="Answer" readonly="true" ref="input"
        v-model="isRoot" @dblclick="handleDblclick($event)"
        @blur="handleBlur($event)" @keyup.enter="handleBlur($event)">
    </div>
    <div class="bt-node-input-container" v-else>
      <input type="text" placeholder="Answer" readonly="true" ref="input"
        v-model="node.data" @dblclick="handleDblclick($event)"
        @blur="handleBlur($event)" @keyup.enter="handleBlur($event)">
    </div>
    <button @click="addChild" class="bt-node-add">
      <md-icon>add</md-icon>
    </button>
    <span v-if="!isRoot" @click="deleteMe" class="close">
      <md-icon>
        delete
      </md-icon>
    </span>
    <div class="bt-node-children">
      <bt-tree-node :node="child" v-for="(child, index) in node.children" :key="index" @deleted="deleteNode" />
    </div>
  </div>
</template>

<script>
/**
 * A tree node.
 *
 * @typedef {Object} Node
 * @property {string} data - The node's data
 * @property {Node[]} children - The node's children
 */

/**
 * Tree node component.
 *
 * @author Marcel Herd
 * @module components/edit/TreeNode
 *
 * @param {Node} node - the node which this component represents
 * @param {string} [isRoot] - if set, shows this value instead and makes the node undeleteable and read-only
 */
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
    /**
     * Adds new child to the node.
     *
     * @method addChild
     */
    addChild () {
      this.node.children.push({
        data: '',
        children: []
      })
    },

    /**
     * Propagates deleted event.
     * Event contains the node's data.
     *
     * @method deleteMe
     */
    deleteMe () {
      // We set data to this components unique identifier, because
      // data is later used to identify which node is to be deleted.
      // This way, we minimize the chance of accidental collisions from user input
      this.node.data = this._uid
      this.$emit('deleted', this.node.data)
    },

    /**
     * Finds and deletes the child node with the given data.
     *
     * @method deleteNode
     * @param {string} data - the data of the deleted node
     */
    deleteNode (data) {
      const index = this.node.children.findIndex((item) => item.data === data)
      this.node.children.splice(index, 1)
    },

    /**
     * Double click event handler.
     * Makes the node editable, if it is not the root.
     *
     * @method handleDblclick
     * @param {event} $event - the double click event
     */
    handleDblclick ($event) {
      if (!this.isRoot) {
        $event.target.readOnly = ''
      }
    },

    /**
     * Blur event handler.
     * Makes the node read-only.
     *
     * @method handleBlur
     * @param {event} $event - the blur event
     */
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
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  outline: 0;
  padding: 10px;
}

.bt-node-input-container input {
  background: transparent;
  min-width: 300px;
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

.bt-tree-node .bt-node-add {
  border: 0;
  background-color: #101929;
  color: white;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.bt-tree-node .bt-node-add:hover {
  cursor: pointer;
  background-color: #FAD232;
  color: black;
}

.bt-tree-node .close {
  padding: 8px;
  margin-left: 20px;
}
.bt-tree-node .close:hover {
  cursor: pointer;
  color: #FAD232;
}

.bt-tree-node .bt-tree-node {
  margin-top: 10px;
  margin-left: 20px;
}
</style>
