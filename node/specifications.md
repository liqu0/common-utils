# LiquidOxygen Node implementation specifications

## Classes

* Node _(may use alternative if occupied)_
* NodeNavigator _(Node.Navigator if cannot define multiple classes in one file)_

_For function names, languages should follow their specific styling guidelines_
---

## Node

### Functions

#### Constructor
Argument: name of node as string
Synopsis: create an empty node.

#### setValue
Arguments: name of value as string, value as object
Synopsis: set value of given name to given value under this node.
Returns: nothing

#### getValue
Argument: name of value as string
Synopsis: get value of given name under this node.
Returns: value of given name

#### addChild
Argument: name of node (child) as string
Synopsis: add an empty node of given name as child under this node.
Returns: false if child already exists; otherwise true

#### getChild
Argument: name of node (child) as string
Synopsis: get child of given name under this node.
Returns: node of given name as child under this node.

#### to string (language-dependent function)
Returns: "[Node#" + name of this node + "]"

### Fields

#### name
Synopsis: name of this node.

---

## NodeNavigator

### Functions

#### Constructor
Arguments: root node, path delimiter as single-character string
Synopsis: create a NodeNavigator based on the given root node, parsing paths using the given path delimiter.

#### navigate
`private`
Arguments: (to be finished)