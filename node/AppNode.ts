class AppNode {
	name: string;
	children: AppNode[];
	values: {[key: string]: any};
	
	constructor(name: string) {
		this.name = name;
		this.children = [];
		this.values = {};
	}

	setValue(key: string, val: any) : void {
		this.values[key] = val;
	}

	getValue(key: string) : any {
		return this.values[key];
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
		let paths: string[] = this.parseExpression(expr);
		return this.navigate(paths.slice(0, -1), createFolders).getValue(paths.slice(-1)[0]);
	}

	setValue(expr: string, val: any, createFolders: boolean) : void {
		let paths: string[] = this.parseExpression(expr);
		this.navigate(paths.slice(0, -1), createFolders).setValue(paths.slice(-1)[0], val);
	}
}