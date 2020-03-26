import cn from 'classnames';

import toggle from '../../toggle';
import focus from '../../focus';

import { colors } from '../../theme';

export default global => {
  const descendants = global.root.descendants();
  // Each node
  const node = global.selection.tree
    .selectAll(`.${global.classnames.node}`)
    .data(descendants, ({ data: { id } }) => id);

  // Node enter
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('opacity', 0)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`)
    // Event listeners
    .on('dblclick', n => {
      toggle(global, n);
      global.instance.redraw();
    });
  // Node enter + update
  nodeEnter
    .merge(node)
    .attr('class', ({ focused, inPath }) =>
      cn(global.classnames.node, {
        [global.classnames.focused]: focused,
        [global.classnames.inPath]: inPath,
      })
    )
    .style('cursor', 'pointer')
    .transition()
    .attr('opacity', 1)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // Node circle
  nodeEnter
    .append('circle')
    .attr(
      'r',
      global.fixedNodeSize === false
        ? ({ data: { hitcount = 1 } }) =>
            Math.log(typeof hitcount === 'number' ? hitcount : 1) + 1
        : global.fixedNodeSize
    )
    .attr('fill', colors.off)
    .on('click', n => {
      try {
        // Making sure is the same reference
        const tmpNode = global.root
          .descendants()
          .filter(({ data: { id } }) => id === n.data.id)[0];
        focus(global, tmpNode);
        global.instance.redraw();
      } catch (_) {}
    });

  // Node info group
  const nodeInfo = nodeEnter
    .append('g')
    .attr('transform', ({ depth }) => `translate(0,${depth % 2 ? 10 : -8})`);

  // Node info group label
  const label = nodeInfo
    .append('text')
    .attr('class', global.classnames.label)
    .attr('y', 4)
    .attr('font-size', '0.8em')
    .attr('text-anchor', 'middle')
    .style(
      'text-shadow',
      '0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff'
    )
    .on('click', node => {
      // Emit event from the instance registrations
      for (const listeners of global.instance._listenersPerType
        .get('click')
        .values()) {
        listeners(new CustomEvent('click', { detail: node.data }));
      }
    });
  // Label name
  label
    .append('tspan')
    .attr('class', global.classnames.name)
    .attr('fill', node => {
      if (global.searchTerm) {
        const name = node.data.name ? node.data.name.toLowerCase() : '';
        if (name.startsWith(global.searchTerm.toLowerCase())) return '#8B0000';
      }
      return '#000000';
    });
  // Label arrow
  label
    .append('tspan')
    .attr('class', global.classnames.arrow)
    .on('click', node => {
      toggle(global, node);
      global.instance.redraw();
    });

  if (global.root.data.hitdist && global.root.data.hitdist.length) {
    // Node info histogram group
    const hits = nodeInfo
      .append('g')
      .attr('class', global.classnames.hits) // mirror transform
      .attr('transform', 'scale(1,-1)');
    // Histogram background
    hits
      .append('rect')
      .attr('class', global.classnames.hitsBg)
      .attr('fill', '#fff')
      .attr('opacity', 0.5)
      .attr('x', -global.nBins)
      .attr('y', -20)
      .attr('width', global.nBins * 2)
      .attr('height', 10);
    // Histogram bars
    const bins = hits
      .selectAll(`.${global.classnames.bin}`)
      // .data(({ focused, data: { hitdist = [] } }) =>
      //   hitdist.map(bin => ({ focused, bin })),
      // );
      .data(({ data: { hitdist = [] } }) => hitdist);
    bins
      .enter()
      .append('rect')
      .attr('class', global.classnames.bin)
      .attr('x', (_, index) => index * 2 - global.nBins)
      .attr('y', -20)
      .attr('width', 2)
      // .attr('height', ({ bin }) => bin * 10 / global.maxCountBin)
      .attr('height', bin => (bin * 10) / global.maxCountBin)
      .attr('fill', colors.off);
  }

  node.selectAll(`.${global.classnames.name}`).attr('fill', node => {
    if (global.searchTerm) {
      const name = node.data.name ? node.data.name.toLowerCase() : '';
      if (name.startsWith(global.searchTerm.toLowerCase())) return '#8B0000';
    }
    return '#000000';
  });

  // Node exit
  node.exit().remove();

  // Get label names
  global.selection.tree
    .selectAll(`.${global.classnames.label} > .${global.classnames.name}`)
    .text(
      ({ data: { name, hitcount } }) =>
        `${name}${typeof hitcount === 'undefined' ? '' : `\n(${hitcount})`}`
    );
  // Get label arrows
  global.selection.tree
    .selectAll(`.${global.classnames.label} > .${global.classnames.arrow}`)
    .text(({ _children }) => (_children ? ' →' : ''));
};
