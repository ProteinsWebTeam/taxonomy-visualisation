const WIDTH = 200;
const HEIGHT = 100;

export default ({ selection: { focus }, focused, nBins, maxCountBin }) => {
  const binWidth = WIDTH / nBins;

  const histogram = focus.selectAll('.hits').data([focused]);

  const bins = histogram
    .data([focused])
    .selectAll('.bin')
    .data(({ data: { hitdist = [] } }) => hitdist);
  bins
    .enter()
    .append('rect')
    .attr('class', 'bin')
    .attr('fill', 'steelblue')
    .attr('x', (_, index) => index * binWidth)
    .attr('width', binWidth)
    .attr('height', HEIGHT)
    .attr('y', HEIGHT)
    .merge(bins)
    .transition()
    .attr('y', bin => HEIGHT - bin * HEIGHT / maxCountBin);
};
