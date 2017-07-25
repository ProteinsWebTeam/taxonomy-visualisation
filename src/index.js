import * as d3 from 'd3';

// extending d3's defaults
import hierarchy from 'hierarchy';

import collapse from 'collapse';
import focus from 'focus';
import toggle from 'toggle';

import data from '../examples/2';

window.d3 = d3;

const svgEl = document.getElementById('root');

const pixelRatio = window.pixelRatio || 1;

let { width, height } = svgEl.getBoundingClientRect();
[width, height] = [width * pixelRatio, height * pixelRatio];

svgEl.setAttribute('width', width);
svgEl.setAttribute('height', height);
svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);

const svg = d3.select(svgEl);
const g = svg.append('g').attr('transform', 'translate(55, 0)');

const tree = d3.tree().size([height - 40, width - 150]);
// .separation((a, b) => Math.log(a.data.count) + Math.log(b.data.count));

const root = hierarchy(data).sort((a, b) => b.data.hitcount - a.data.hitcount);

const global = {
  root: root,
  all: root.descendants(),
};

const maxCountBin = d3.max(global.all, d => d3.max(d.data.hitdist));
const nBins = root.data.hitdist.length;

global.all.forEach(d => {
  if (d.depth > 2) collapse(d);
});

const updateLinks = () => {
  // Each link
  const link = g
    .selectAll('.link')
    .data(tree(global.root).links(), ({ target: { data: { id } } }) => id);

  // Link enter
  link
    .enter()
    .append('path')
    .attr('opacity', 0)
    // Link enter + update
    .merge(link)
    .attr(
      'class',
      ({ target: { inPath } }) => `link${inPath ? ' in-path' : ''}`,
    )
    .attr('fill', 'none')
    .transition()
    .attr('d', d3.linkHorizontal().x(({ y }) => y).y(({ x }) => x))
    .attr('stroke', ({ target: { inPath } }) => (inPath ? '#a24' : 'steelblue'))
    .attr('stroke-width', ({ target: { inPath } }) => (inPath ? 2 : 1))
    .attr('opacity', 1);

  // Link exit
  link.exit().remove();
};

const updateFocusRing = () => {
  // Each focus ring (only ever going to be one)
  const focusRing = g.selectAll('.focus-ring').data([global.focused]);

  // Focus ring enter
  focusRing
    .enter()
    .append('circle')
    .attr('class', 'focus-ring')
    .attr('fill', '#a24')
    .attr('transform', ({ x, y }) => `translate(${y},${x})`)
    // Focus ring enter + update
    .merge(focusRing)
    .transition()
    .ease(d3.easeElastic.period(1))
    .attr('r', ({ data: { hitcount = 1 } }) => Math.log(hitcount) + 1 + 5)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`);
};

const updateNodes = () => {
  // Each node
  const node = g
    .selectAll('.node')
    .data(global.root.descendants(), ({ data: { id } }) => id);

  // Node enter
  const nodeG = node
    .enter()
    .append('g')
    .attr('opacity', 0)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`)
    // Event listeners
    .on('click', node => {
      focus(global, node);
      update();
    })
    .on('dblclick', node => {
      toggle(node);
      update();
    });
  // Node enter + update
  nodeG
    .merge(node)
    .attr('class', ({ focused }) => `node${focused ? ' focused' : ''}`)
    .style('cursor', 'pointer')
    .transition()
    .attr('opacity', 1)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  nodeG
    .append('circle')
    .attr('r', ({ data: { hitcount = 1 } }) => Math.log(hitcount) + 1)
    .attr('fill', 'steelblue');
  const nodeGG = nodeG
    .append('g')
    .attr('transform', ({ depth }) => `translate(0,${depth % 2 ? 10 : -8})`);
  const text = nodeGG
    .append('text')
    .attr('y', 4)
    .attr('font-size', '0.8em')
    .attr('text-anchor', 'middle')
    .style(
      'text-shadow',
      '0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff',
    );
  text.append('tspan').attr('class', 'label');
  text.append('tspan').attr('class', 'arrow').on('click', node => {
    toggle(node);
    update();
  });
  const hits = nodeGG
    .append('g')
    .attr('class', 'hits')
    .attr('transform', 'scale(1, -1)');
  hits
    .append('rect')
    .attr('class', 'hits-bg')
    .attr('fill', '#fff')
    .attr('opacity', 0.5)
    .attr('x', -nBins)
    .attr('y', -20)
    .attr('width', nBins * 2)
    .attr('height', 10);
  hits
    .selectAll('.bin')
    .data(({ data: { hitdist = [] } }) => hitdist)
    .enter()
    .append('rect')
    .attr('class', 'bin')
    .attr('fill', '#a24')
    .attr('x', (_, i) => i * 2 - nBins)
    .attr('y', -20)
    .attr('width', 2)
    .attr('height', datum => datum * 10 / maxCountBin);

  // Node exit
  node.exit().remove();

  // get labels
  g
    .selectAll('.label')
    .text(
      ({ data: { name, hitcount } }) =>
        `${name}${typeof hitcount === 'undefined' ? '' : ` (${hitcount})`}`,
    );
  g.selectAll('.arrow').text(({ _children }) => (_children ? ' →' : ''));
};

const update = () => {
  updateLinks();
  updateFocusRing();
  updateNodes();
};

const keyDownEventListener = e => {
  switch (e.key) {
    case 'ArrowDown':
      // Focus next sibling
      focus(global, global.focused.sibling(1));
      update();
      break;
    case 'ArrowUp':
      // Focus previous sibling
      focus(global, global.focused.sibling(-1));
      update();
      break;
    case 'ArrowLeft':
      // Focus parent
      focus(global, global.focused.parent);
      update();
      break;
    case 'ArrowRight':
      // If collapsed, open
      if (global.focused._children) {
        toggle(global, global.focused);
      }
      // Focus first child
      focus(global, global.focused.children && global.focused.children[0]);
      update();
      break;
    case 'Enter':
      toggle(global, global.focused);
      update();
      break;
    default:
      return;
  }
  e.preventDefault();
};

// move focus according to keyboard
svgEl.addEventListener('keydown', keyDownEventListener);

focus(global, global.root);
update();
