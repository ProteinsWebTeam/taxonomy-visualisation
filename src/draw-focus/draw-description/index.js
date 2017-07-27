export default ({ selection: { focus }, focused }) => {
  const lineage = focus.select('.lineage');
  const ancestors = lineage
    .selectAll('.ancestor')
    .data(focused.ancestors().reverse());
  ancestors
    .enter()
    .append('a')
    .attr('class', 'ancestor')
    .merge(ancestors)
    .text(d => ` → ${d.data.name}`);
  ancestors.exit().remove();

  const name = focus.selectAll('.name').data([focused]);
  name.text(
    ({ data: { name, hitcount } }) => name + (hitcount ? ` (${hitcount})` : ''),
  );
};
