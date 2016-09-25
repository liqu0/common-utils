# LiquidOxygen Node implementation specifications

## Classes

* Node _(may use alternative if occupied)_
* NodeNavigator _(Node.Navigator if cannot define multiple classes in one file)_

_For function names, languages should follow their specific styling guidelines_

---

## Node

### Functions

#### Constructor
* Argument: name of node as string
* Synopsis: create an empty node.

#### setValue
* Arguments: name of value as string, value as object
* Synopsis: set value of given name to given value under this node.
* Returns: nothing

#### getValue
* Argument: name of value as string
* Synopsis: get value of given name under this node.
* Returns: value of given name

#### addChild
* Argument: name of node (child) as string
* Synopsis: add an empty node of given name as child under this node.
* Returns: false if child already exists; otherwise true

#### getChild
* Argument: name of node (child) as string
* Synopsis: get child of given name under this node.
* Returns: node of given name as child under this node.

#### to string (language-dependent function)
* Returns: "[Node#" + name of this node + "]"

### Fields

#### name
* Synopsis: name of this node.
* Type: string

#### children
* Synopsis: all child nodes under this node.
* Type: collection of nodes

#### values
* Synopsis: a map of all values under this node.
* Type: map of string to object (any)

---

## NodeNavigator

### Functions

#### Constructor
* Arguments: root node, path delimiter as single-character string
* Synopsis: create a NodeNavigator based on the given root node, parsing paths using the given path delimiter.

#### navigate
`private`
* Arguments: paths as string array, create folders? as boolean
* Synopsis: navigates from the root node along the specified path, throwing an error if the next node does not exist and create folders? is false.
* Returns: node with the specified path in relation to the root node; its name is same as the last element in paths.

#### getNodeByPath
* Argument: path as string
* Synopsis: navigates along the specified path to return the last node of the path.
* Returns: the last node of the specified path.

#### createFolders
* Argument: path as string
* Synopsis: navigates along the specified path to return the last node of the path, creating nodes when necessary.
* Returns: the last node of the specified path.

#### getValue
* Argument: path as string
* Synopsis: retrieves the specified value along the specified path.
* Returns: the value retrieved using the specified path.

#### setValue
* Arguments: path as string, value as object (any)
* Synopsis: retrieves reference to the specified value along the specified path, then sets it to the specified value.
* Returns: nothing

### Fields

#### delimiter
* Synopsis: a string that acts as a delimiter when parsing a path to segments.
* Type: a string

#### rootNode
* Synopsis: the base node that this navigator does all of its navigation upon.
* Type: Node