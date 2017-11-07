<template>
  <div>
    <md-input-container md-clearable>
      <label>Option</label>
      <md-input v-model="option"></md-input>
    </md-input-container>
    <md-button class="md-raised"  @click="add">Add option </md-button>
    <div class= "tree">
      <div v-bind:class ="{selected: isActive}" v-if = "tree.root.data !== null" @click.stop ="select(tree.root.data)">{{tree.root.data}} </div>
      <tree-item @clicked = "select" :key = "child.data" v-for = "child in tree.root.children" :node="child">
      </tree-item>
    </div>

  </div>
</template>

<script>
import TreeItem from '@/components/treeItem'

function Node (data) {
  this.data = data
  this.children = []
}

function Tree () {
  this.root = new Node(null)
  this.selected = this.root
}

Tree.prototype.add = function (data) {
  var node = new Node(data)
  var parent = this.selected.data ? this.findBFS(this.selected.data) : null
  if (parent) {
    parent.children.push(node)
  } else {
    if (!this.root) {
      this.root = node
    } else {
      return 'Root node is already assigned'
    }
  }
}
Tree.prototype.remove = function (data) {
  if (this.root.data === data) {
    this.root = null
  }

  var queue = [this.root]
  while (queue.length) {
    var node = queue.shift()
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].data === data) {
        node.children.splice(i, 1)
      } else {
        queue.push(node.children[i])
      }
    }
  }
}
Tree.prototype.contains = function (data) {
  return !!this.findBFS(data)
}
Tree.prototype.findBFS = function (data) {
  var queue = [this.root]
  while (queue.length) {
    var node = queue.shift()
    if (node.data === data) {
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
      isActive: false,
      option: 'none',
      tree: new Tree()
    }
  },
  methods: {
    add () {
      if (this.tree.root.data === null) {
        this.isActive = true
        this.tree.root = new Node(this.option)
        this.tree.selected = this.tree.root
      } else { this.tree.add(this.option) }
    },
    select (data) {
      this.isActive = !this.isActive
      console.log('select in TREE')
      this.tree.selected = data ? this.tree.findBFS(data) : null
    }
  }
}
</script>

<style>
.selected {font-weight:bold;}
</style>
