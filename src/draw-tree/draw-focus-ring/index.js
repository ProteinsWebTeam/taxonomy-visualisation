import { easeElastic } from 'd3-ease';

import { colors } from '../../theme';

export default ({ selection: { tree }, focused, classnames }) => {
  // Each focus ring (only ever going to be one)
  const focusRing = tree.selectAll(`.${classnames.focusRing}`).data([focused]);

  // Focus ring enter
  focusRing
    .enter()
    .append('circle')
    .attr('class', classnames.focusRing)
    .attr('fill', colors.focus)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`)
    // Focus ring enter + update
    .merge(focusRing)
    .transition()
    .ease(easeElastic.period(1))
    .attr(
      'r',
      ({ data: { hitcount = 1 } }) =>
        Math.log(typeof hitcount === 'number' ? hitcount : 1) + 1 + 5
    )
    .attr('transform', ({ x, y }) => `translate(${y},${x})`);
};
