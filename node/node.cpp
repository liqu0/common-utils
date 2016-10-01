#include <iostream>

class Node {
public:
	std::string name;

	Node(std::string name) {
		this.name = name;
	}

	void SetValue(std::string key, void* ptr) {
		this.values[key] = ptr;
	}

	void* GetValue(std::string key) {
		return this.values[key];
	}

	void AddChild(std::string name) {
		this.children.insert(&Node(name));
	}

	Node* GetChild(std::string name) {
		for(Node* node: this.children) {
			if(node->name == name) {
				return node;
			}
		}
		return NULL;
	}

	std::ostream& operator<< (std::ostream& stream, Node& node) {
		return stream << "[Node#" << node.name << "]";
	}

private:
	std::unordered_set<Node*> children;
	std::map<std::string, void*> values;
}

int main(int argc, char const *argv[])
{
	// testing purposes only
	Node MainNode("Main-node");
	std::cout << MainNode << std::endl;
	return 0;
}