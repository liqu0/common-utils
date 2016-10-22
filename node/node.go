package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type Node struct {
	name     string
	children map[*Node]bool
	value    *interface{}
}

type NodeNavigator struct {
	delim    string
	BaseNode *Node
}

func NewNode(name string) *Node {
	return &Node{name, make(map[*Node]bool), nil}
}

func (n *Node) GetValue() *interface{} {
	return n.value
}

func (n *Node) SetValue(val interface{}) {
	n.value = &val
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
				fmt.Printf("NodeNavigator navigation error: while navigating through node %v, next child %s does not exist\n", currentNode, path)
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

func (nn *NodeNavigator) GetValue(path string) *interface{} {
	return nn.navigate(strings.Split(path, nn.delim), false).GetValue()
}

func (nn *NodeNavigator) SetValue(path string, val interface{}) {
	nn.navigate(strings.Split(path, nn.delim), true).SetValue(val)
}

// Start testing

func main() {
	Read := bufio.NewReader(os.Stdin)
	MainNode := NewNode("MainNode")
	MainNavigator := NodeNavigator{"MainNavigator", MainNode}

	for {
		fmt.Print(":> ")
		rawInput, _ := Read.ReadString('\n')
		rawInput = strings.TrimSuffix(rawInput, "\n")
		input := strings.Split(rawInput, " ")
		switch input[0] {
		case "get":
			fmt.Println(*MainNavigator.GetValue(input[1]))
		case "set":
			MainNavigator.SetValue(input[1], input[2])
		default:
			fmt.Printf("?%s\n", input[0])
		}
	}
}
