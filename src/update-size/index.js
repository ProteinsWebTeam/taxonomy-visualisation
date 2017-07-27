const getSize = element => {
  const pixelRatio = window.pixelRatio || 1;

  let { width, height } = element.getBoundingClientRect();

  [width, height] = [width * pixelRatio, height * pixelRatio];

  return {
    pixelRatio,
    width: width * pixelRatio,
    height: height * pixelRatio,
  };
};

export const updateFocusSize = focusSelection => {
  if (!focusSelection) return;
  const { pixelRatio, height } = getSize(focusSelection.node());

  focusSelection.select('svg').style('width', 2 * height / pixelRatio);
};

export const updateTreeSize = (treeSelection, global) => {
  if (!treeSelection) return;
  const { width, height } = getSize(treeSelection.node());

  const margin = width / 14;

  treeSelection.attr('width', width);
  treeSelection.attr('height', height);
  treeSelection.attr('viewBox', `-${0.75 * margin} 0 ${width} ${height}`);

  global.tree.size([height, width - 2 * margin]);
};
