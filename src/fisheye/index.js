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
  }
};
