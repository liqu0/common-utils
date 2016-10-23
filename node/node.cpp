#include <iostream>
#include <set>
#include <vector>
#include <sstream>
#include <stdexcept>

template <class T>
class Node {
public:

  Node(std::string name) {
    this->name = name;
  }

  ~Node() {
    this->children.clear();
  }

  void SetValue(T& value) {
    this->value = value;
  }

  T* GetValue() {
    return &this->value;
  }

  bool AddChild(std::string name) {
    // child should not exist
    if (this->GetChild(name) != NULL)
      return false;

    Node* child = new Node(name);
    this->children.insert(child);
    return true;
  }

  Node* GetChild(std::string name) {
    for(Node* node: this->children) {
      if(node->GetName() == name) {
        return node;
      }
    }
    return NULL;
  }

  std::string GetName() {
    return this->name;
  }

  friend std::ostream& operator<<(std::ostream& stream, const Node& node) {
    return stream << "[Node#" << node.name << "]";
  }

private:
  std::string name;
  std::set<Node*> children;
  T value;
};

template <class T>
class NodeNavigator {
public:

  NodeNavigator(Node<T>* root, char delim) {
    this->rootNode = root;
    this->delimiter = delim;
  }

  Node<T>* GetNodeByPath(std::string& path) {
    return this->navigate(this->split(path), false);
  }

  Node<T>* CreateNodes(std::string& path) {
    return this->navigate(this->split(path), true);
  }

  T* GetValue(std::string& path) {
    return this->navigate(this->split(path), false)->GetValue();
  }

  void SetValue(std::string& path, T& value) {
    this->navigate(this->split(path), true)->SetValue(value);
  }

private:
  char delimiter;
  Node<T>* rootNode;

  std::vector<std::string> split(const std::string& input) {
    std::stringstream sstr(input);
    std::string seg;
    std::vector<std::string> segList;

    while (std::getline(sstr, seg, this->delimiter)) {
      segList.push_back(seg);
    }

    return segList;
  }

  Node<T>* navigate(std::vector<std::string> paths, bool create) {
    Node<T>* currentNode = this->rootNode;
    for (std::string& path: paths) {
      if (create)
        currentNode->AddChild(path);
      if (currentNode->GetChild(path) == NULL)
        throw std::runtime_error("Node does not exist: " + path);
      currentNode = currentNode->GetChild(path);
    }
    return currentNode;
  }
};

/* The following lines are only for testing */

std::vector<std::string> TokenSplit(std::string& str, char delim) {
  std::stringstream stream(str);
  std::string token;
  std::vector<std::string> tokenList;

  while (std::getline(stream, token, delim)) {
    tokenList.push_back(token);
  }

  return tokenList;
}

int main(int argc, char const *argv[])
{
  // testing purposes only
  Node<std::string> MainNode("Main-node");
  std::cout << MainNode << std::endl;
  NodeNavigator<std::string> Navigator(&MainNode, '/');

  std::string input;
  std::vector<std::string> args;
  std::string* nsValue;
  while (true) {
    std::cout << "==>";
    std::getline(std::cin, input);
    args = TokenSplit(input, ' ');
    
    if (args[0] == "set") {
      // navigator SetValue
      Navigator.SetValue(args[1], args[2]);
      std::cout << "value set" << std::endl;
    }
    else if (args[0] == "get") {
      // navigator GetValue
      nsValue = Navigator.GetValue(args[1]);
      std::cout << *nsValue << std::endl;
    }
    else {
      std::cout << "?" << input << std::endl;
    }
  }
  return 0;
}
