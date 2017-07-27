import drawLinks from './draw-links';
import drawFocusRing from './draw-focus-ring';
import drawNodes from './draw-nodes';

export default global => {
  drawLinks(global);
  drawFocusRing(global);
  drawNodes(global);
};
