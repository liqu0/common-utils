import java.util.*;
import java.util.regex.Pattern;

public class Node<T> {
	// Testing purposes only
	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		Node<String> mainNode = new Node<>("MainNode");
		Navigator nav = new Navigator(mainNode, "/");
		while (true) {
			System.out.print(">>> ");
			String[] rawArgs = s.nextLine().split(" ");
			switch (rawArgs[0]) {
				case "set":
					nav.setValue(rawArgs[1], rawArgs[2], true);
					break;
				case "get":
					System.out.println(nav.getValue(rawArgs[1], true));
					break;
				default:
					System.out.println("?" + rawArgs[0]);
			}
		}
	}
	// Testing ends

	static class Navigator<T> {
		public Node<T> root;
		public String delim;

		public Navigator(Node<T> root, String delim) {
			this.root = root;
			this.delim = delim == null ? "\\/" : Pattern.quote(delim);
		}

		private Node<T> navigate(String[] paths, boolean createFolders) {
			Node<T> currentNode = this.root;
			Node<T> nextNode = null;
			for (String path : paths) {
				nextNode = currentNode.getChild(path);
				if (nextNode == null) {
					if (!createFolders)
						throw new NullPointerException("Navigating through node " + currentNode + ", child " + path + " not found");
					currentNode.addChild(path);
				}
				currentNode = nextNode == null ? currentNode.getChild(path) : nextNode;
			}
			return currentNode;
		}

		public Node getNodeByPath(String path) {
			return this.navigate(path.split(this.delim), false);
		}

		public Node createFolders(String path) {
			return this.navigate(path.split(this.delim), true);
		}

		public void setValue(String path, T val, boolean createFolders) {
			this.navigate(path.split(this.delim), createFolders).setValue(val);
		}

		public T getValue(String path, boolean createFolders) {
			return this.navigate(path.split(this.delim), createFolders).getValue();
		}
	}

	public final String name;
	private Set<Node<T>> children = new HashSet<>();
	private T value = null;

	public Node(String name) {
		this.name = name;
	}

	public void setValue(T val) {
		this.value = val;
	}

	public T getValue() {
		return this.value;
	}

	public boolean addChild(String name) {
		if (this.getChild(name) != null)
			return false;
		this.children.add(new Node(name));
		return true;
	}

	public Node getChild(String name) {
		for (Node node : this.children) {
			if (node.name.equals(name))
				return node;
		}
		return null;
	}

	@Override
	public String toString() {
		return "[Node#" + this.name + "]";
	}
}