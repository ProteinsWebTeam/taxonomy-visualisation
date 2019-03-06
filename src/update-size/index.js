const getSize = element => {
  const { width, height } = element.getBoundingClientRect();

  return { width, height };
};

export const updateFocusSize = focusSelection => {
  if (!focusSelection) return;
  const { height } = getSize(focusSelection.node());

  focusSelection.select('svg').style('width', 2 * height);
};

export const updateTreeSize = (treeSelection, global) => {
  if (!treeSelection) return;
  const { width, height } = getSize(treeSelection.node());

  const margin = width / 14;

  treeSelection.attr('width', width);
  treeSelection.attr('height', height);
  treeSelection.attr('viewBox', `${-global.margin} 0 ${width} ${height}`);

  global.tree.size([height, width - 2 * margin]);
};
