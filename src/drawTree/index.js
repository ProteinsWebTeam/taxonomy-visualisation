import drawLinks from './drawLinks';
import drawFocusRing from './drawFocusRing';
import drawNodes from './drawNodes';

const draw = global => {
  drawLinks(global);
  drawFocusRing(global);
  drawNodes(global);
};

let planned = false;

export default global => {
  if (planned) return;
  planned = true;
  requestAnimationFrame(() => {
    draw(global);
    planned = false;
  });
};
