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

select(node,id) {
  console.log(node);
		this.selected = node; // should be value of text input
    this.nodeId = id; // should be ID of node
    console.log("this.selected");
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
    childDiv.onclick = this.select(child,childDiv.id);
    parentDiv.appendChild(childDiv);
    console.log(this);
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
   console.log(tree);
  }
}
