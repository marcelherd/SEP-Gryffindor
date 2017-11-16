/**
 * This module realises the tree nodes
 *
 * @module model/treenode
 */

 /**
 * Consctructor for tree node
 *
 * @param {String} data - the data that is saved in this particular tree node
 */
function Node (data) {
  this.data = data
  this.children = []
  this.id = 0
}
export default Node
