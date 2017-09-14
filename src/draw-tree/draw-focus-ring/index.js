import { easeElastic } from 'd3';

import { colors } from '../../theme';

export default ({ selection: { tree }, focused }) => {
  // Each focus ring (only ever going to be one)
  const focusRing = tree.selectAll('.focus-ring').data([focused]);

  // Focus ring enter
  focusRing
    .enter()
    .append('circle')
    .attr('class', 'focus-ring')
    .attr('fill', colors.focus)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`)
    // Focus ring enter + update
    .merge(focusRing)
    .transition()
    .ease(easeElastic.period(1))
    .attr('r', ({ data: { hitcount = 1 } }) => Math.log(hitcount) + 1 + 5)
    .attr('transform', ({ x, y }) => `translate(${y},${x})`);
};
