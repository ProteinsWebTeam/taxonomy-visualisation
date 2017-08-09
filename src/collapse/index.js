const collapse = node => {
  if (typeof node !== 'object' || Array.isArray(node)) {
    throw new Error('"collapse" function was not passed a valid tree');
  }
  if (node.children) {
    node._children = node.children;
    node.children = null;
    node._children.forEach(collapse);
  }
};

export default collapse;
