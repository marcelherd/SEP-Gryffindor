<template>
  <div>
    <md-input-container md-clearable>
      <label>Option</label>
      <md-input v-model="option"></md-input>
    </md-input-container>
    <md-button class="md-raised" @click="add">Add option </md-button>
    <div class= "tree">
      <div v-bind:class ="{selected: this.$store.state.selected === tree.root}" @click="select(tree.root.id)" v-if = "tree.root.data !== null">{{tree.root.data}} </div>
      <tree-item :key = "child.id" v-for = "child in tree.root.children" :node="child">
      </tree-item>
    </div>
    
  </div>
</template>

<script>
import TreeItem from '@/components/treeItem'

// following functions implement Tree data structure

function Node (data) {
  this.data = data
  this.children = []
  this.id = 0
}

function Tree () {
  this.root = new Node(null)
  this.nodeID = 0
}

Tree.prototype.add = function (data, nodeID) {
  let parent
  if (this.findBFS(nodeID)) {
    parent = this.findBFS(nodeID)
  } else {
    parent = null
  }
  let node = new Node(data)
  this.nodeID++
  node.id = this.nodeID
  if (parent) {
    parent.children.push(node)
  } else {
    if (!this.root) {
      this.root = node
    } else {
      return console.log('Root node is already assigned')
    }
  }
}
Tree.prototype.remove = function (nodeID) {
  if (this.root.id === nodeID) {
    this.root = null
  }

  var queue = [this.root]
  while (queue.length) {
    var node = queue.shift()
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].id === nodeID) {
        node.children.splice(i, 1)
      } else {
        queue.push(node.children[i])
      }
    }
  }
}
Tree.prototype.contains = function (id) {
  return !!this.findBFS(id)
}
Tree.prototype.findBFS = function (nodeID) {
  var queue = [this.root]
  while (queue.length) {
    var node = queue.shift()
    if (node.id === nodeID) {
      return node
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i])
    }
  }
  return null
}
Tree.prototype._preOrder = function (node, fn) {
  if (node) {
    if (fn) {
      fn(node)
    }
    for (var i = 0; i < node.children.length; i++) {
      this._preOrder(node.children[i], fn)
    }
  }
}
Tree.prototype._postOrder = function (node, fn) {
  if (node) {
    for (var i = 0; i < node.children.length; i++) {
      this._postOrder(node.children[i], fn)
    }
    if (fn) {
      fn(node)
    }
  }
}
Tree.prototype.traverseDFS = function (fn, method) {
  var current = this.root
  if (method) {
    this['_' + method](current, fn)
  } else {
    this._preOrder(current, fn)
  }
}
Tree.prototype.traverseBFS = function (fn) {
  var queue = [this.root]
  while (queue.length) {
    var node = queue.shift()
    if (fn) {
      fn(node)
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i])
    }
  }
}
Tree.prototype.print = function () {
  if (!this.root) {
    return console.log('No root node found')
  }
  var newline = new Node('|')
  var queue = [this.root, newline]
  var string = ''
  while (queue.length) {
    var node = queue.shift()
    string += node.data.toString() + ' '
    if (node === newline && queue.length) {
      queue.push(newline)
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i])
    }
  }
  console.log(string.slice(0, -2).trim())
}
Tree.prototype.printByLevel = function () {
  if (!this.root) {
    return console.log('No root node found')
  }
  var newline = new Node('\n')
  var queue = [this.root, newline]
  var string = ''
  while (queue.length) {
    var node = queue.shift()
    string += node.data.toString() + (node.data !== '\n' ? ' ' : '')
    if (node === newline && queue.length) {
      queue.push(newline)
    }
    for (var i = 0; i < node.children.length; i++) {
      queue.push(node.children[i])
    }
  }
  console.log(string.trim())
}

export default {
  name: 'app-tree',
  components: {
    'tree-item': TreeItem
  },
  data () {
    return {
      option: 'none',
      tree: new Tree()
    }
  },
  methods: {
    // adds element to tree when click event is called and calls giveTreeToParent
    add () {
      if (this.tree.root.data === null) {
        this.tree.root = new Node(this.option)
        this.$store.dispatch('setSelected', this.tree.root)
      } else { this.tree.add(this.option, this.$store.state.selected.id) }
      this.giveTreeToParent()
    },
    // Gives Tree to Parent(Create.vue) so that it can be saved as JSON
    giveTreeToParent () {
      this.$store.dispatch('updateTree', this.tree)
    },
    select (nodeID) {
      this.$store.dispatch('setSelected', this.tree.root)
    }
  }
}
</script>

<style>
.selected  { font-weight:bold; }
</style>
