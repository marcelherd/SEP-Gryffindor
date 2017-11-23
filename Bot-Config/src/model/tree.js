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
}
export default Tree
