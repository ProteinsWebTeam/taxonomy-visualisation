const collapse = node => {
  if (node.children) {
    node._children = node.children;
    node.children = null;
    node._children.forEach(collapse);
  }
};

export default collapse;
