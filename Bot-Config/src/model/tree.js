import Node from '@/model/treenode'

/**
 * This module implements the tree logic
 *
 * @module model/tree
 */
class Tree {
  constructor () {
    this.root = new Node(null)
    this.nodeID = 0
  }
  /**
   * Adds new node to tree
   * @param {string} data - data that is added to new Node in tree
   * @param {number} nodeID - Id of parents node(node that new node should be added to)
   */
  add (data, nodeID) {
    let parent
    (this)
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
        return ('Root node is already assigned')
      }
    }
  }
  /**
   * Removes node in tree
   * @param {number} nodeID - Id of node that is to be deleted
   */
  remove (nodeID) {
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
    /**
    * Finds node in tree with breadth-first-search
    * @param {number} nodeID - Id of node that is looked for
    * @returns {node | null} - when node is found the particular node otherwise null
    */
  findBFS (nodeID) {
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
    /**
   * Checks whether node exists in tree
   * @param {number} nodeID - Id of node which is searched for in tree
   */
    // Tree.prototype.contains = function (nodeID) {
    //   return !!this.findBFS(nodeID)
    // }
    // Tree.prototype._preOrder = function (node, fn) {
    //   if (node) {
    //     if (fn) {
    //       fn(node)
    //     }
    //     for (var i = 0; i < node.children.length; i++) {
    //       this._preOrder(node.children[i], fn)
    //     }
    //   }
    // }
    // Tree.prototype._postOrder = function (node, fn) {
    //   if (node) {
    //     for (var i = 0; i < node.children.length; i++) {
    //       this._postOrder(node.children[i], fn)
    //     }
    //     if (fn) {
    //       fn(node)
    //     }
    //   }
    // }
    // Tree.prototype.traverseDFS = function (fn, method) {
    //   var current = this.root
    //   if (method) {
    //     this['_' + method](current, fn)
    //   } else {
    //     this._preOrder(current, fn)
    //   }
    // }
    // Tree.prototype.traverseBFS = function (fn) {
    //   var queue = [this.root]
    //   while (queue.length) {
    //     var node = queue.shift()
    //     if (fn) {
    //       fn(node)
    //     }
    //     for (var i = 0; i < node.children.length; i++) {
    //       queue.push(node.children[i])
    //     }
    //   }
    // }
    // Tree.prototype.print = function () {
    //   if (!this.root) {
    //     return ('No root node found')
    //   }
    //   var newline = new Node('|')
    //   var queue = [this.root, newline]
    //   var string = ''
    //   while (queue.length) {
    //     var node = queue.shift()
    //     string += node.data.toString() + ' '
    //     if (node === newline && queue.length) {
    //       queue.push(newline)
    //     }
    //     for (var i = 0; i < node.children.length; i++) {
    //       queue.push(node.children[i])
    //     }
    //   }
    //   (string.slice(0, -2).trim())
    // }
    // Tree.prototype.printByLevel = function () {
    //   if (!this.root) {
    //     return ('No root node found')
    //   }
    //   var newline = new Node('\n')
    //   var queue = [this.root, newline]
    //   var string = ''
    //   while (queue.length) {
    //     var node = queue.shift()
    //     string += node.data.toString() + (node.data !== '\n' ? ' ' : '')
    //     if (node === newline && queue.length) {
    //       queue.push(newline)
    //     }
    //     for (var i = 0; i < node.children.length; i++) {
    //       queue.push(node.children[i])
    //     }
    //   }
    //   (string.trim())
    // }
}
export default Tree
