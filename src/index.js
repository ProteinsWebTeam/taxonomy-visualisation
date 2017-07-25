import * as d3 from 'd3';

import hierarchy from 'hierarchy';
import collapse from 'collapse';

import data from '../examples/2';

const svgEl = document.getElementById('root');

const pixelRatio = window.pixelRatio || 1;

let {width, height} = svgEl.getBoundingClientRect();
[width, height] = [width * pixelRatio, height * pixelRatio];

svgEl.setAttribute('width', width);
svgEl.setAttribute('height', height);
svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);

const svg = d3.select(svgEl);
const g = svg.append('g').attr('transform', 'translate(55, 0)');

const tree = d3.tree()
  .size([height - 40, width - 150]);
  // .separation((a, b) => Math.log(a.data.count) + Math.log(b.data.count));

const root = hierarchy(data).sort((a, b) => (b.data.count || b.data.hitcount) - (a.data.count || a.data.hitcount));
let focused;

const allNodes = root.descendants();

const maxCountBin = d3.max(allNodes, d => d3.max(d.data.hits || d.data.hitdist || []));
const nBins = (root.data.hits || root.data.hitdist).length;

allNodes.forEach(d => {
  d.inPath = true;
  if (d.depth > 2) collapse(d);
});

const focus = d => {
  if (!d) return;
  try {
    d3.event.stopPropagation();
  } catch(_) {}
  allNodes.forEach(n => n.inPath = n.focused = false);
  d.focused = true;
  d.ancestors().forEach(n => n.inPath = true);
  d.descendants().forEach(n => n.inPath = true);
  focused = d;
  update();
};

const toggle = d => {
  try {
    d3.event.stopPropagation();
  } catch(_) {}
  if (d.children) {
    collapse(d);
  } else {
    [d.children, d._children] = [d._children, d.children]
  }
  focus(focused);
};

// const focusRing = g.append('g')
//   .attr('class', 'focus-ring')
//   .attr('opacity', 0);

function update() {
  // Each link
  const link = g.selectAll('.link').data(
    tree(root).links(),
    ({source, target}) => `${source.data.id}-${target.data.id}`
  )
    .attr('class', ({source, target}) => (
      `link${(source.inPath && target.inPath) ? ' in-path' : ''}`
    ));

  // Link enter
  link.enter().append('path')
    .attr('class', ({source, target}) => (
      `link${(source.inPath && target.inPath) ? ' in-path' : ''}`
    ))
    .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
    .attr('opacity', 0)
    .transition()
    .attr('opacity', 1);

  // Link update
  link.transition().attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x));

  // Link exit
  link.exit().remove();

  // Focus ring
  const focusRing = g.selectAll('.focus-ring').data([focused]);
  focusRing.enter().append('circle').attr('class', 'focus-ring')
    .attr('r', d => Math.log(d.data.count || d.data.hitcount) + 1 + 5)
    .attr('transform', d => `translate(${d.y || 0},${d.x || 0})`);
  focusRing.transition().ease(d3.easeElastic.period(1))
    .attr('r', d => Math.log(d.data.count || d.data.hitcount) + 1 + 5)
    .attr('transform', d => `translate(${d.y || 0},${d.x || 0})`);

  // Each node
  const node = g.selectAll('.node').data(root.descendants(), d => d.data.id)
    .attr('class', d => `node${d.focused ? ' focused' : ''}`);

  // Node enter
  const nodeEnter = node.enter();

  const nodeG = nodeEnter.append('g')
    .attr('class', d => `node${d.focused ? ' focused' : ''}`)
    .attr('transform', d => `translate(${d.y},${d.x})`)
    .on('click', focus)
    .on('dblclick', toggle);
  nodeG.attr('opacity', 0).transition().attr('opacity', 1);
  nodeG.append('circle')
    .attr('r', d => Math.log(d.data.count || d.data.hitcount) + 1);
  const nodeGG = nodeG.append('g')
    .attr('transform', d => `translate(0,${d.depth % 2 ? 10 : -8})`);
  const text = nodeGG.append('text')
    .attr('y', 4)
    .style('text-anchor', 'middle');
  text.append('tspan').attr('class', 'label');
  text.append('tspan').attr('class', 'arrow')
    .on('click', toggle);
  const hits = nodeGG.append('g').attr('class', 'hits')
    .attr('transform', 'scale(1, -1)');
  hits.append('rect')
    .attr('class', 'hits-bg')
    .attr('x', -nBins)
    .attr('y', -20)
    .attr('width', nBins * 2)
    .attr('height', 10);
  hits.selectAll('.bin').data(d => d.data.hits || d.data.hitdist)
    .enter().append('rect')
    .attr('class', 'bin')
    .attr('x', (_, i) => i * 2 - nBins)
    .attr('y', -20)
    .attr('width', 2)
    .attr('height', d => d * 10 / maxCountBin);

  // Node update
  node.transition().attr('transform', d => `translate(${d.y},${d.x})`);

  // Node exit
  node.exit().remove();

  // get labels
  g.selectAll('.label')
    .text(d => `${d.data.name} (${d.data.count || d.data.hitcount})`);
  g.selectAll('.arrow').text(d => {
    return d._children ? ' →' : ''
  });
};

// move focus according to keyboard
svgEl.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      // Focus next sibling
      focus(focused.sibling(1));
      break;
    case 'ArrowUp':
      // Focus previous sibling
      focus(focused.sibling(-1));
      break;
    case 'ArrowLeft':
      // Focus parent
      focus(focused.parent);
      break;
    case 'ArrowRight':
      // If collapsed, open
      if (focused._children) {
        [focused.children, focused._children] = [focused._children, null];
      }
      // Focus first child
      focus(focused.children && focused.children[0]);
      break;
    case 'Enter':
      toggle(focused);
      break;
    default:
      return;
  }
  e.preventDefault();
});

focus(root);
