import { zoom, event } from 'd3';
export default (treeSelection, global) => {
  let tmpX = global.margin;
  let tmpY = 0;

  const zooming = () => {
    const { width, height } = treeSelection.node().getBoundingClientRect();
    if (event.sourceEvent.movementX) tmpX += event.sourceEvent.movementX;
    if (event.sourceEvent.movementY) tmpY += event.sourceEvent.movementY;
    const k = (global.scale = event.transform.k);
    const edges = {
      right: width - global.margin,
      left: k * (-width + 10 * global.margin),
      top: k * (-height + 4 * global.margin),
      bottom: height - 4 * k * global.margin,
    };
    if (tmpX > edges.right) tmpX = edges.right;
    if (tmpX < edges.left) tmpX = edges.left;
    if (tmpY > edges.bottom) tmpY = edges.bottom;
    if (tmpY < edges.top) tmpY = edges.top;
    treeSelection.attr('viewBox', `${-tmpX} ${-tmpY} ${width} ${height}`);
    global.instance.redraw();
  };

  treeSelection.call(
    zoom()
      .on('zoom', zooming)
      .scaleExtent([1, 5])
  );
};
