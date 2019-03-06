import { zoom, event } from 'd3';
export default (treeSelection, global) => {
  let tmpX = global.margin;
  let tmpY = 0;
  const zooming = () => {
    if (event.sourceEvent.movementX) tmpX += event.sourceEvent.movementX;
    if (event.sourceEvent.movementY) tmpY += event.sourceEvent.movementY;
    global.scale = event.transform.k;
    const { width, height } = treeSelection.node().getBoundingClientRect();
    treeSelection.attr('viewBox', `${-tmpX} ${-tmpY} ${width} ${height}`);
    global.instance.redraw();
  };

  treeSelection.call(zoom().on('zoom', zooming));
};
