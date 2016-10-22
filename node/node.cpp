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

  void AddChild(std::string name) {
    // child should not exist
    if (this->GetChild(name) != NULL)
      return;

    Node* child = new Node(name);
    this->children.insert(child);
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

int main(int argc, char const *argv[])
{
  // testing purposes only
  Node<std::string> MainNode("Main-node");
  std::cout << MainNode << std::endl;
  NodeNavigator<std::string> Navigator(&MainNode, '/');
  
  std::string path;
  std::string value;
  char action;
  std::string inputBuffer;
  std::string* nsValue;
  while (true) {
    std::cout << "path >>";
    std::getline(std::cin, path);

    while (true) {
      std::cout << "action (s,g,n) >>";
      std::cin >> action;
      std::cin.ignore();
      if (action == 's' ||
          action == 'g' ||
          action == 'n')
        break;
    }

    if (action == 's') {
      std::cout << "value >>";
      std::getline(std::cin, value);
    }

    switch (action) {
      case 's':
        Navigator.SetValue(path, value);
        break;
      case 'g':
        nsValue = Navigator.GetValue(path);
        std::cout << *nsValue << std::endl;
        break;
      case 'n':
        Navigator.CreateNodes(path);
        break;
    }
  }
  return 0;
}
