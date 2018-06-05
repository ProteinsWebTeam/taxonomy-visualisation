const f = (x, x0, d) =>
  x0 + (x > x0 ? 1 : -1) * d * Math.sqrt(Math.abs(x - x0));
const DEFAULT_DX = 15;
const DEFAULT_DY = 20;

const recalculatePos = (node, x0, y0) => {
  const x = node.x || 0;
  const y = node.y || 0;
  const newX = f(x, x0, DEFAULT_DX);
  const newY = f(y, y0, DEFAULT_DY);
  if ((x < x0 && x > newX) || (x > x0 && x < newX)) node.x = newX;
  if ((y < y0 && y > newY) || (y > y0 && y < newY)) node.y = newY;
  if (node.children) node.children.forEach(ch => recalculatePos(ch, x0, y0));
};

export default global => {
  if (
    global.enableFisheye &&
    global.focused &&
    global.focused !== global.root
  ) {
    const x = global.focused.x || 0;
    const y = global.focused.y || 0;
    if (x) recalculatePos(global.root, x, y);
  }
};
