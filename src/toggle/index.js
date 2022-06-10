import collapse from '../collapse';
import focus from '../focus';

export default (global, event, node) => {
  try {
    event.stopPropagation();
  } catch (_) {}
  if (node.children) {
    collapse(node);
  } else {
    [node.children, node._children] = [node._children, node.children];
  }
  // refocus, to be sure to have all paths drawn correctly
  focus(global, global.focused);
};
