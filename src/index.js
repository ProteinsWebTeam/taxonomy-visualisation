import * as d3 from 'd3';

// extending d3's defaults
import hierarchy from 'hierarchy';

import collapse from 'collapse';
import focus from 'focus';
import toggle from 'toggle';

import draw from 'drawTree';

import data from '../examples/2';

window.d3 = d3;

const svgEl = document.getElementById('root');

const pixelRatio = window.pixelRatio || 1;

let { width, height } = svgEl.getBoundingClientRect();
[width, height] = [width * pixelRatio, height * pixelRatio];

svgEl.setAttribute('width', width);
svgEl.setAttribute('height', height);
svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);

const root = hierarchy(data).sort((a, b) => b.data.hitcount - a.data.hitcount);

const global = {
  tree: d3.tree().size([height - 40, width - 150]),
  root: root,
  domRoot: d3
    .select(svgEl)
    .append('g')
    .attr('transform', `translate(${width / 20}, 0)`),
};

global.all = global.root.descendants();
global.maxCountBin = d3.max(global.all, node => d3.max(node.data.hitdist));
global.nBins = global.root.data.hitdist.length;

global.all.forEach(node => {
  if (node.depth > 2) collapse(node);
});

const keyDownEventListener = e => {
  switch (e.key) {
    case 'ArrowDown':
      // Focus next sibling
      focus(global, global.focused.sibling(1));
      draw(global);
      break;
    case 'ArrowUp':
      // Focus previous sibling
      focus(global, global.focused.sibling(-1));
      draw(global);
      break;
    case 'ArrowLeft':
      // Focus parent
      focus(global, global.focused.parent);
      draw(global);
      break;
    case 'ArrowRight':
      // If collapsed, open
      if (global.focused._children) {
        toggle(global, global.focused);
      }
      // Focus first child
      focus(global, global.focused.children && global.focused.children[0]);
      draw(global);
      break;
    case 'Enter':
      toggle(global, global.focused);
      draw(global);
      break;
    default:
      return;
  }
  e.preventDefault();
};

// move focus according to keyboard
svgEl.addEventListener('keydown', keyDownEventListener);

document.addEventListener('resize', () => draw(global));

focus(global, global.root);

// first draw
draw(global);
