import drawLinks from './draw-links';
import drawFocusRing from './draw-focus-ring';
import drawNodes from './draw-nodes';
import applyFisheyeIfEnabled from '../fisheye';

export default global => {
  global.tree(global.root);
  applyFisheyeIfEnabled(global);
  if (global.enableZooming)
    global.root.descendants().forEach(d => {
      d.x *= global.scale;
      d.y *= global.scale;
    });
  drawLinks(global);
  drawFocusRing(global);
  drawNodes(global);
};
