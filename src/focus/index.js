import { event } from 'd3';

const removeFocus = node => (node.inPath = node.focused = false);

const setFocusPath = node => (node.inPath = true);

const setFocus = node => {
  node.focused = true;
  node.ancestors().forEach(setFocusPath);
  node.descendants().forEach(setFocusPath);
};

export default (global, node) => {
  if (!node) return;
  try {
    event.stopPropagation();
  } catch (_) {}
  global.all.forEach(removeFocus);
  setFocus(node);
  global.focused = node;
};
