class AppNode {
	name: string;
	children: AppNode[];
	value: any;
	
	constructor(name: string) {
		this.name = name;
		this.children = [];
		this.value = null;
	}

	setValue(val: any) : void {
		this.value = val;
	}

	getValue() : any {
		return this.value;
	}

	getChild(name: string) : AppNode {
		for (let node of this.children) {
			if(node.name == name) {
				return node;
			}
		}
	}

	addChild(name: string) : boolean {
		if(this.getChild(name) == undefined) {
			this.children.push(new AppNode(name));
			return true;
		}
		return false;
	}

	toString() : string {
		return `[AppNode#${this.name}]`
	}
}

class NodeNavigator {
	delimiter: string;
	rootNode: AppNode;

	constructor(delimiter: string, rootNode: AppNode) {
		this.delimiter = delimiter;
		this.rootNode = rootNode;
	}

	private parseExpression(expr: string) : string[] {
		return expr.split(this.delimiter);
	}

	private navigate(paths: string[], createFolders: boolean) : AppNode {
		let currentNode: AppNode = this.rootNode;
		for (let path of paths) {

			let nextChild = currentNode.getChild(path);
			if (nextChild == undefined) {
				if (!createFolders)
					throw `While navigating through node ${currentNode.toString()}, next child ${path} does not exist`;
				currentNode.addChild(path);
			}

			currentNode = nextChild || currentNode.getChild(path);
		}
		return currentNode;
	}

	getNodeByPath(expr: string) : AppNode {
		return this.navigate(this.parseExpression(expr), false);
	}

	createFolders(expr: string) : AppNode {
		return this.navigate(this.parseExpression(expr), true);
	}

	getValue(expr: string, createFolders: boolean) : any {
		return this.navigate(this.parseExpression(expr), createFolders).getValue();
	}

	setValue(expr: string, val: any, createFolders: boolean) : void {
		this.navigate(this.parseExpression(expr), createFolders).setValue(val);
	}
}