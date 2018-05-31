const f = (x, x0, d) =>
  x0 + (x > x0 ? 1 : -1) * d * Math.sqrt(Math.abs(x - x0));
const DEFAULT_D = 15;

const recaluculateX = (node, x0) => {
  const x = node.x || 0;
  const newX = f(x, x0, DEFAULT_D);
  if ((x < x0 && x > newX) || (x > x0 && x < newX)) node.x = newX;
  if (node.children) node.children.forEach(ch => recaluculateX(ch, x0));
};

export default global => {
  if (
    global.enableFisheye &&
    global.focused &&
    global.focused !== global.root
  ) {
    const x = global.focused.x || 0;
    if (x) recaluculateX(global.root, x);
  }
};
