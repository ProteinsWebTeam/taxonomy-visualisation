import focus from '../../focus';

export default global => {
  const { selection, focused } = global;
  const lineage = selection.focus.select('.lineage');
  const ancestors = lineage
    .selectAll('.ancestor')
    .data(focused.ancestors().reverse());
  ancestors
    .enter()
    .append('a')
    .attr('class', 'ancestor')
    .on('click', node => {
      focus(global, node);
      global.instance.redraw();
    })
    .merge(ancestors)
    .text(node => ` → ${node.data.name}`);
  ancestors.exit().remove();

  const name = selection.focus.selectAll('.name').data([focused]);
  name.text(
    ({ data: { name, hitcount } }) => name + (hitcount ? ` (${hitcount})` : '')
  );
};
