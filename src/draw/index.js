import drawFocus from 'draw-focus';
import drawTree from 'draw-tree';

const draw = global => {
  if (global.selection.focus) drawFocus(global);
  if (global.selection.tree) drawTree(global);
};

let isDrawPlanned = false;

export default global => {
  // Bail if a draw is already planned for the next frame, no need to draw twice
  if (isDrawPlanned) return;
  isDrawPlanned = true;
  requestAnimationFrame(() => {
    draw(global);
    isDrawPlanned = false;
  });
};
