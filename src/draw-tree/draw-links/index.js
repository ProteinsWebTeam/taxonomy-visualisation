import { linkHorizontal } from 'd3';

import { colors } from '../../theme';

export default global => {
  // Each link
  const link = global.selection.tree
    .selectAll('.link')
    .data(
      global.tree(global.root).links(),
      ({ target: { data: { id } } }) => id
    );

  // Link enter
  link
    .enter()
    .append('path')
    .attr('opacity', 0)
    // Link enter + update
    .merge(link)
    .attr(
      'class',
      ({ target: { inPath } }) => `link${inPath ? ' in-path' : ''}`
    )
    .attr('fill', 'none')
    .transition()
    .attr(
      'd',
      linkHorizontal()
        .x(({ y }) => y)
        .y(({ x }) => x)
    )
    .attr(
      'stroke',
      ({ target: { inPath } }) => colors[inPath ? 'focus' : 'off']
    )
    .attr('stroke-width', ({ target: { inPath } }) => (inPath ? 2 : 1))
    .attr('opacity', 1);

  // Link exit
  link.exit().remove();
};
