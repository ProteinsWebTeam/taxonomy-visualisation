import { linkHorizontal } from 'd3-shape';
import cn from 'classnames';

import { colors } from '../../theme';

export default (global) => {
  // Each link
  const link = global.selection.tree
    .selectAll(`.${global.classnames.link}`)
    .data(
      global.root.links(),
      ({
        source: {
          data: { id: sid },
        },
        target: {
          data: { id: tid },
        },
      }) => `${sid}_${tid}`
    );

  // Link enter
  link
    .enter()
    .insert('path', ':first-child')
    .attr('opacity', 0)
    // Link enter + update
    .merge(link)
    .attr('class', ({ target: { inPath } }) =>
      cn(global.classnames.link, { [global.classnames.inPath]: inPath })
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
