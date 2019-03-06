/**
 * Calculates the new value for a single axis point.
 * @param {number} x - The value to be recalculated.
 * @param {number} x0 - Fisheye center.
 * @param {number} d - Distance after calculation of the closest point to the fishye center.
 *                     f(x0+1,x0,d) === d.
 * @return The new value for the given coordinate
 */
const f = (x, x0, d) =>
  x0 + (x > x0 ? 1 : -1) * d * Math.sqrt(Math.abs(x - x0));

/**
 * Default factor for transformation in X axis
 */
const DEFAULT_DX = 15;
/**
 * Default factor for transformation in Y axis
 */
const DEFAULT_DY = 20;

/**
 * Recalculates positions for a node based on the fisheye calculation.
 * It calls itself recursively to calculate positions of its childrent
 * @param {object} node - The minimal object is `{x:0, y:0, children:[]}`.
 * @param {number} x0 - X coordinate of the Fisheye center.
 * @param {number} y0 - Y coordinate of the Fisheye center.
 */
const recalculatePos = (node, x0, y0) => {
  const x = node.x || 0;
  const y = node.y || 0;
  const newX = f(x, x0, DEFAULT_DX);
  const newY = f(y, y0, DEFAULT_DY);
  if ((x < x0 && x > newX) || (x > x0 && x < newX)) node.x = newX;
  if ((y < y0 && y > newY) || (y > y0 && y < newY)) node.y = newY;
  if (node.children) node.children.forEach(ch => recalculatePos(ch, x0, y0));
};

const OVER = 1;
const UNDER = 2;
/**
 * It changes the order among the sibilings of the focused node.
 * if there are nodes among its sibilings that are out of the scope it will move
 * the focused node to either the top or the bottom, forcing the other nodes to
 * be in scope.
 * @param {object} global - The common object of all the components of the library.
 * @param {int} type - 1: correct nodes over. 2: correct nodes under.
 */
const correctNodesOutOfWorkspace = (global, type) => {
  const { root, focused } = global;
  if (focused.parent) {
    const parent = focused.parent;
    const i = parent.children.indexOf(focused);
    if (i == 0 || i == parent.children.length - 1) return;
    if (type == OVER) {
      parent.children = [
        focused,
        ...parent.children.slice(i + 1),
        ...parent.children.slice(0, i),
      ];
    } else {
      parent.children = [
        ...parent.children.slice(i + 1),
        ...parent.children.slice(0, i),
        focused,
      ];
    }
    global.tree(root);
    const x = global.focused.x || 0;
    const y = global.focused.y || 0;
    if (x) recalculatePos(global.root, x, y);
  }
};

const correctNodesOutside = global => {
  const height = global.svg.getBoundingClientRect().height;
  const targetNodeDescendants = (
    global.focused.parent || global.focused
  ).descendants();
  const overOutlayers = targetNodeDescendants.filter(({ x }) => x < 0);
  const underOutlayers = targetNodeDescendants.filter(({ x }) => x > height);
  if (overOutlayers.length) {
    correctNodesOutOfWorkspace(global, OVER);
  } else if (underOutlayers.length) {
    correctNodesOutOfWorkspace(global, UNDER);
  }
};
/**
 * Applies the fisheye recalculations to the root object in the global attribute.
 * It only gets executed if fissheye is enabled and there is a focused node other than the root.
 * @param {object} global - The common object of all the components of the library.
 */
export default global => {
  if (global.fisheye && global.focused && global.focused !== global.root) {
    const x = global.focused.x || 0;
    const y = global.focused.y || 0;
    if (x) recalculatePos(global.root, x, y);
    if (global.shouldCorrectNodesOutside) correctNodesOutside(global);
  }
};
