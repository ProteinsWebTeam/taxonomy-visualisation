import drawFocus from '../draw-focus';
import drawTree from '../draw-tree';

const draw = global => {
  if (global.selection.focus) drawFocus(global);
  if (global.selection.tree) drawTree(global);
};

// let isDrawPlanned = false;

export default global => {
  // Bail if a draw is already planned for the next frame, no need to draw twice
  if (global._isDrawPlanned) return;
  global._isDrawPlanned = true;
  if (!global.test) global.test = 1;
  requestAnimationFrame(() => {
    draw(global);
    global._isDrawPlanned = false;
  });
  global.test++;
};
