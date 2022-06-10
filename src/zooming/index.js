import { zoom, zoomIdentity } from 'd3-zoom';

export const resetZooming = (treeSelection, global) => {
  treeSelection.call(global._zoom.transform, zoomIdentity);
};

export default (treeSelection, global) => {
  let tmpX = global.margin;
  let tmpY = 0;

  const zooming = (event) => {
    const { width, height } = treeSelection.node().getBoundingClientRect();
    if (event) {
      if (event.movementX) tmpX += event.movementX;
      if (event.movementY) tmpY += event.movementY;
    } else {
      // If the sourceEvent is null we assume the reset has been triggered.
      tmpX = global.margin;
      tmpY = 0;
    }
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
  global._zoom = zoom()
    .filter(() => {
      // WheelEvent is associated to Zooming. To allow panning, mouse events except WheelEvent should be allowed
      if (!(event instanceof WheelEvent)) return true;
      return !global.useCtrlToZoom || event.ctrlKey;
    })
    .on('zoom', zooming)
    .scaleExtent([1, 5]);

  treeSelection.call(global._zoom);
};
