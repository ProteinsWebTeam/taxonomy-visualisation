const getSize = svgEl => {
  const pixelRatio = window.pixelRatio || 1;

  let { width, height } = svgEl.getBoundingClientRect();

  [width, height] = [width * pixelRatio, height * pixelRatio];

  return {
    width: width * pixelRatio,
    height: height * pixelRatio,
  };
};

export default (global, treeSelection) => {
  if (!treeSelection) return;
  const { width, height } = getSize(treeSelection.node());

  const margin = width / 14;

  treeSelection.attr('width', width);
  treeSelection.attr('height', height);
  treeSelection.attr('viewBox', `-${0.75 * margin} 0 ${width} ${height}`);

  global.tree.size([height, width - 2 * margin]);
};
