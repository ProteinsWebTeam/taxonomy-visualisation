import drawLinks from './drawLinks';
import drawFocusRing from './drawFocusRing';
import drawNodes from './drawNodes';

export default global => {
  drawLinks(global);
  drawFocusRing(global);
  drawNodes(global);
};
