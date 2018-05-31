import drawLinks from './draw-links';
import drawFocusRing from './draw-focus-ring';
import drawNodes from './draw-nodes';
import applyFisheyeIfEnabled from '../fisheye';

export default global => {
  global.tree(global.root);
  applyFisheyeIfEnabled(global);
  drawLinks(global);
  drawFocusRing(global);
  drawNodes(global);
};
