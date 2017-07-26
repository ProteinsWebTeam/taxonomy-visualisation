import toggle from 'toggle';
import focus from 'focus';

import draw from 'drawTree';

export default global => {
  // Each node
  const node = global.domRoot
    .selectAll('.node')
    .data(global.root.descendants(), ({ data: { id } }) => id);

  // Node enter
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('opacity', 0)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`)
    // Event listeners
    .on('click', node => {
      focus(global, node);
      draw(global);
    })
    .on('dblclick', node => {
      toggle(node);
      draw(global);
    });
  // Node enter + update
  nodeEnter
    .merge(node)
    .attr('class', ({ focused }) => `node${focused ? ' focused' : ''}`)
    .style('cursor', 'pointer')
    .transition()
    .attr('opacity', 1)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // Node circle
  nodeEnter
    .append('circle')
    .attr('r', ({ data: { hitcount = 1 } }) => Math.log(hitcount) + 1)
    .attr('fill', 'steelblue');

  // Node info group
  const nodeInfo = nodeEnter
    .append('g')
    .attr('transform', ({ depth }) => `translate(0,${depth % 2 ? 10 : -8})`);

  // Node info group label
  const label = nodeInfo
    .append('text')
    .attr('class', 'label')
    .attr('y', 4)
    .attr('font-size', '0.8em')
    .attr('text-anchor', 'middle')
    .style(
      'text-shadow',
      '0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff',
    );
  // Label name
  label.append('tspan').attr('class', 'name');
  // Label arrow
  label.append('tspan').attr('class', 'arrow').on('click', node => {
    toggle(node);
    draw(global);
  });

  // Node info histogram group
  const hits = nodeInfo
    .append('g')
    .attr('class', 'hits')
    .attr('transform', 'scale(1, -1)');
  // Histogram background
  hits
    .append('rect')
    .attr('class', 'hits-bg')
    .attr('fill', '#fff')
    .attr('opacity', 0.5)
    .attr('x', -global.nBins)
    .attr('y', -20)
    .attr('width', global.nBins * 2)
    .attr('height', 10);
  // Histogram bars
  const bins = hits
    .selectAll('.bin')
    .data(({ focused, data: { hitdist = [] } }) =>
      hitdist.map(bin => ({ focused, bin })),
    );
  bins
    .enter()
    .append('rect')
    .attr('class', 'bin')
    .attr('x', (_, index) => index * 2 - global.nBins)
    .attr('y', -20)
    .attr('width', 2)
    .attr('height', ({ bin }) => bin * 10 / global.maxCountBin)
    .attr('fill', 'steelblue');

  // Node exit
  node.exit().remove();

  // Get label names
  global.domRoot
    .selectAll('.label > .name')
    .text(
      ({ data: { name, hitcount } }) =>
        `${name}${typeof hitcount === 'undefined' ? '' : ` (${hitcount})`}`,
    );
  // Get label arrows
  global.domRoot
    .selectAll('.label > .arrow')
    .text(({ _children }) => (_children ? ' →' : ''));
};
