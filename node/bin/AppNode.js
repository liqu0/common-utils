var AppNode = (function () {
    function AppNode(name) {
        this.name = name;
        this.children = [];
        this.value = null;
    }
    AppNode.prototype.setValue = function (val) {
        this.value = val;
    };
    AppNode.prototype.getValue = function () {
        return this.value;
    };
    AppNode.prototype.getChild = function (name) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.name == name) {
                return node;
            }
        }
    };
    AppNode.prototype.addChild = function (name) {
        if (this.getChild(name) == undefined) {
            this.children.push(new AppNode(name));
            return true;
        }
        return false;
    };
    AppNode.prototype.toString = function () {
        return "[AppNode#" + this.name + "]";
    };
    return AppNode;
}());
var NodeNavigator = (function () {
    function NodeNavigator(delimiter, rootNode) {
        this.delimiter = delimiter;
        this.rootNode = rootNode;
    }
    NodeNavigator.prototype.parseExpression = function (expr) {
        return expr.split(this.delimiter);
    };
    NodeNavigator.prototype.navigate = function (paths, createFolders) {
        var currentNode = this.rootNode;
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            var nextChild = currentNode.getChild(path);
            if (nextChild == undefined) {
                if (!createFolders)
                    throw "While navigating through node " + currentNode.toString() + ", next child " + path + " does not exist";
                currentNode.addChild(path);
            }
            currentNode = nextChild || currentNode.getChild(path);
        }
        return currentNode;
    };
    NodeNavigator.prototype.getNodeByPath = function (expr) {
        return this.navigate(this.parseExpression(expr), false);
    };
    NodeNavigator.prototype.createFolders = function (expr) {
        return this.navigate(this.parseExpression(expr), true);
    };
    NodeNavigator.prototype.getValue = function (expr, createFolders) {
        return this.navigate(this.parseExpression(expr), createFolders).getValue();
    };
    NodeNavigator.prototype.setValue = function (expr, val, createFolders) {
        this.navigate(this.parseExpression(expr), createFolders).setValue(val);
    };
    return NodeNavigator;
}());
