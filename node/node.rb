
class Node
  
  def initialize(name)
    @name = name
    @children = Array.new
    @value = nil
  end

  def set_value(value)
    @value = value
  end

  def get_value
    return @value
  end
  
  def get_child(name)
    ret_val = nil
    @children.each do |child|
      if child.instance_variable_get(:@name) == name
        ret_val = child
        break
      end
    end
    return ret_val
  end

  def add_child(name)
    if self.get_child(name) != nil
      return false
    end
    @children << Node.new(name)
    return true
  end

  def to_s
    "[Node##{@name}]"
  end
  
end

class NodeNavigator

  def initialize(root_node, delim)
    @root_node = root_node
    @delimiter = delim
  end

  def get_node_by_path(path)
    navigate(path.split(@delimiter), false)
  end

  def create_nodes(path)
    navigate(path.split(@delimiter), true)
  end

  def get_value(path)
    navigate(path.split(@delimiter), false).get_value
  end

  def set_value(path, val)
    navigate(path.split(@delimiter), true).set_value(val)
  end

  private
  def navigate(paths, create)
    current_node = @root_node
    paths.each do |path|
      if create then
        current_node.add_child(path)
      end
      current_node = current_node.get_child(path)
      if current_node == nil then
        raise "While navigating through node #{current_node}, next node #{path} does not exist"
      end
    end
    current_node
  end
end

# testing only

main_node = Node.new("main-node")
main_nav = NodeNavigator.new(main_node, '/')

while true
  print "@> "
  input = gets.split(' ')
  
  if input[0] == "set"
    main_nav.set_value(input[1], input[2])
    puts "value set"
  elsif input[0] == "get"
    puts main_nav.get_value(input[1])
  else
    puts "?#{input[0]}"
  end
end
