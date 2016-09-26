package main

import (
	"fmt"
	"strings"
	"bufio"
	"os"
)

type Node struct {
	name string
	children map[*Node]bool
	values map[string]interface{}
}

type NodeNavigator struct {
	delim string
	BaseNode *Node
}

func NewNode(name string) *Node {
	return &Node{name, make(map[*Node]bool), make(map[string]interface{})}
}

func (n *Node) GetValue(key string) interface{} {
	return n.values[key];
}

func (n *Node) SetValue(key string, val interface{}) {
	n.values[key] = val;
}

func (n *Node) GetChild(name string) *Node {
	for key, _ := range n.children {
		if key.name == name {
			return key
		}
	}
	return nil
}

func (n *Node) AddChild(name string) bool {
	if n.GetChild(name) != nil {
		return false
	}
	n.children[NewNode(name)] = true
	return true
}

func (n *Node) String() string {
	return fmt.Sprintf("[Node#%s]", n.name)
}

// Start NodeNavigator functions

func (nn *NodeNavigator) navigate(paths []string, create bool) *Node {
	currentNode := nn.BaseNode
	for _, path := range paths {
		if currentNode.GetChild(path) == nil {
			if !create {
				fmt.Printf("NodeNavigator navigation error: while navigating through node %v, next child %s does not exist", currentNode, path)
			} else {
				currentNode.AddChild(path)
			}
		}
		currentNode = currentNode.GetChild(path)
	}
	return currentNode
}

func (nn *NodeNavigator) GetNodeByPath(path string) *Node {
	return nn.navigate(strings.Split(path, nn.delim), false)
}

func (nn *NodeNavigator) CreateFolders(path string) *Node {
	return nn.navigate(strings.Split(path, nn.delim), true)
}

func (nn *NodeNavigator) GetValue(path string) interface{} {
	parsedPath := strings.Split(path, nn.delim)
	return nn.navigate(parsedPath[:len(parsedPath) - 1], false).GetValue(parsedPath[len(parsedPath) - 1])
}

func (nn *NodeNavigator) SetValue(path string, val interface{}) {
	parsedPath := strings.Split(path, nn.delim)
	nn.navigate(parsedPath[:len(parsedPath) - 1], true).SetValue(parsedPath[len(parsedPath)-1], val)
}

// Start testing

func main() {
	Read := bufio.NewReader(os.Stdin)
	MainNode := NewNode("MainNode")
	MainNavigator := NodeNavigator{"MainNavigator", MainNode}

	for ;; {
		fmt.Print(":> ")
		rawInput, _ := Read.ReadString('\n')
		rawInput = strings.TrimSuffix(rawInput, "\n")
		input := strings.Split(rawInput, " ")
		switch input[0] {
		case "get":
			fmt.Println(MainNavigator.GetValue(input[1]))
		case "set":
			MainNavigator.SetValue(input[1], input[2])
		default:
			fmt.Printf("?%s\n", input[0])
		}
	}
}