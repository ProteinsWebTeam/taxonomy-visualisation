const getSize = (element) => {
  const { width, height } = element.getBoundingClientRect();

  return { width, height };
};

const getMargin = (width) => width / 14;
export const updateFocusSize = (focusSelection) => {
  if (!focusSelection) return;
  const { height } = getSize(focusSelection.node());

  focusSelection.select('svg').style('width', 2 * height);
};

export const updateTreeSize = (treeSelection, global) => {
  if (!treeSelection) return;
  const { width, height } = getSize(treeSelection.node());

  const margin = getMargin(width);

  treeSelection.attr('width', width);
  treeSelection.attr('height', height);
  treeSelection.attr('viewBox', `${-global.margin} 0 ${width} ${height}`);

  global.tree.size([height, width - 2 * margin]);
};

export const updateWidth = (width, global) => {
  const [h] = global.tree.size();
  global.tree.size([h, width - 2 * getMargin(width)]);
  global.selection.tree.attr('viewBox', `${-global.margin} 0 ${width} ${h}`);
};
