class Node(object):

	def __init__(self, name):
		self.name = name
		self.children = []
		self.value = None

	def get_child(self, name):
		for child in self.children:
			if child.name == name:
				return child

	def add_child(self, name):
		if self.get_child(name) != None:
			return False
		self.children.append(Node(name))
		return True

	def get_value(self):
		return self.value

	def set_value(self, val):
		self.value = val

	def __str__(self):
		return "[Node#{}]".format(self.name)

class NodeNavigator(object):

	def __init__(self, root_node, delimiter):
		self.root_node = root_node
		self.delim = delimiter

	def _nav(self, paths, create):
		current_node = self.root_node
		for path in paths:
			if create:
				current_node.add_child(path)
			current_node = current_node.get_child(path)
			if current_node == None:
				raise Exception("while navigating through node {}, child with name {} does not exist".format(current_node, path))
		return current_node

	def get_node(self, path):
		return self._nav(path.split(self.delim), False)

	def create_folders(self, path):
		return self._nav(path.split(self.delim), True)

	def get_value(self, path):
		return self._nav(path.split(self.delim), False).get_value()

	def set_value(self, path, val):
		self._nav(path.split(self.delim), True).set_value(val)
		

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