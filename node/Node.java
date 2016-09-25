import java.util.*;
import java.util.regex.Pattern;

public class Node {
	// Testing purposes only
	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		Node mainNode = new Node("MainNode");
		Navigator nav = new Navigator(mainNode, null);
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

	static class Navigator {
		public Node root;
		public String delim;

		public Navigator(Node root, String delim) {
			this.root = root;
			this.delim = delim == null ? "\\/" : Pattern.quote(delim);
		}

		private Node navigate(String[] paths, boolean createFolders) {
			Node currentNode = this.root;
			Node nextNode = null;
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

		public void setValue(String path, Object val, boolean createFolders) {
			String[] parsedPath = path.split(this.delim);
			this.navigate(Arrays.copyOf(parsedPath, parsedPath.length - 1), createFolders).setValue(parsedPath[parsedPath.length - 1], val);
		}

		public Object getValue(String path, boolean createFolders) {
			String[] parsedPath = path.split(this.delim);
			return this.navigate(Arrays.copyOf(parsedPath, parsedPath.length - 1), createFolders).getValue(parsedPath[parsedPath.length - 1]);
		}
	}

	public final String name;
	private Set<Node> children = new HashSet<>();
	private HashMap<String, Object> values = new HashMap<>();

	public Node(String name) {
		this.name = name;
	}

	public void setValue(String name, Object val) {
		this.values.put(name, val);
	}

	public Object getValue(String name) {
		return this.values.get(name);
	}

	public void addChild(String name) {
		this.children.add(new Node(name));
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