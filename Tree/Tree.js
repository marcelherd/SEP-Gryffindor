class Node {
	constructor(data) {
		this.parent = null;
		this.data = data;
		this.children = [];
	}

	setParent(node) {
		this.parent = node;
	}

	setChild(node) {
		this.children.push(node);
	}

	getParent() {
		return this.parent();
	}

	getChildren() {
		return this.children;
	}

}
class Tree {
	constructor(value) {
		this.root = [];
		this.selected = null;
    this.nodeId = "";
    this.nodeCounter = 0;
    this.add(value);
	}

select(node,child) {
    if(this.selected !== null && this.selected.data === node.data) {
      this.selected = null;
      this.nodeId = "";
			child.style.background = "#FFFFFF"
    }
  else{
		 this.selected = node; // should be value of text input
     this.nodeId = child.id; // should be ID of node
		 child.style.background = "#FFD700"
    }
	}

	add(data) {
    this.nodeCounter++;
    let child;
    let parentDiv;
    let childDiv = document.createElement('div');
    childDiv.innerHTML = data;
    childDiv.id = "node" + this.nodeCounter;

		if (this.selected === null) {
      child = new Node(data);
			this.root.push(child);
      parentDiv = document.getElementById('output');
		} else {
			child = new Node(data);
			child.setParent(this.selected);
			this.selected.setChild(child);
      parentDiv = document.getElementById(this.nodeId);
		}
    let self = this;
    childDiv.onclick = function() {self.select(child,childDiv)};
    parentDiv.appendChild(childDiv);
    console.log(tree);
	}
}

let node;
let tree = null;
function add(){
  let value = document.getElementById('input').value;
  if(tree === null) {
    tree = new Tree(value);
  }
  else{
    tree.add(value);
  }
}
