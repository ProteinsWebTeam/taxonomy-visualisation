import { linkHorizontal } from 'd3';

export default global => {
  // Each link
  const link = global.domRoot
    .selectAll('.link')
    .data(
      global.tree(global.root).links(),
      ({ target: { data: { id } } }) => id,
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
      ({ target: { inPath } }) => `link${inPath ? ' in-path' : ''}`,
    )
    .attr('fill', 'none')
    .transition()
    .attr('d', linkHorizontal().x(({ y }) => y).y(({ x }) => x))
    .attr('stroke', ({ target: { inPath } }) => (inPath ? '#a24' : 'steelblue'))
    .attr('stroke-width', ({ target: { inPath } }) => (inPath ? 2 : 1))
    .attr('opacity', 1);

  // Link exit
  link.exit().remove();
};
