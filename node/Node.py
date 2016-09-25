class Node(object):

	def __init__(self, name):
		self.name = name
		self.children = []
		self.values = {}

	def get_child(self, name):
		for child in self.children:
			if child.name == name:
				return child

	def add_child(self, name):
		if self.get_child(name) != None:
			return False
		self.children.append(Node(name))
		return True

	def get_value(self, name):
		return self.values.get(name)

	def set_value(self, name, val):
		self.values[name] = val

	def __str__(self):
		return "[Node#{}]".format(self.name)

class NodeNavigator(object):

	def __init__(self, root_node, delimiter):
		self.root_node = root_node
		self.delim = delimiter

	def _nav(self, paths, create):
		current_node = self.root_node
		next_node = None
		for path in paths:
			next_node = current_node.get_child(path)
			if next_node == None:
				if not create:
					raise Exception("while navigating through node {}, child with name {} does not exist".format(current_node, path))
				current_node.add_child(path)
				next_node = current_node.get_child(path)
			current_node = next_node
		return current_node

	def get_node(self, path):
		return self._nav(path.split(self.delim), False)

	def create_folders(self, path):
		return self._nav(path.split(self.delim), True)

	def get_value(self, path):
		paths = path.split(self.delim)
		return self._nav(paths[:-1], False).get_value(paths[-1])

	def set_value(self, path, val):
		paths = path.split(self.delim)
		self._nav(paths[:-1], True).set_value(paths[-1], val)
		

# Testing starts here

mn = Node("MainNode")
nn = NodeNavigator(mn, "/")

while True:
	raw_args = input("=> ").split(" ")
	if raw_args[0] == "set":
		nn.set_value(raw_args[1], raw_args[2])
	elif raw_args[0] == "get":
		print(nn.get_value(raw_args[1]))
	else:
		print("?"+raw_args[0])