/* eslint-disable no-console */
import TaxonomyVisualisation from '../src/index';

import data from './data/1';

// One way to instantiate the visualisation:
const visualisation = new TaxonomyVisualisation(data, {
  initialMaxNodes: 30,
  enableFisheye: true,
});
// visualisation.data = data;
visualisation.tree = document.getElementById('tree-root');
visualisation.focus = document.getElementById('focus-root');

visualisation.addEventListener('focus', event => {
  console.log('custom focus event', event.detail);
});

visualisation.focus.addEventListener('click', event =>
  console.log(visualisation.getDataFromEvent(event))
);

// Other way to do it:
// const visualisation = new SpeciesVisualisation(
//   data,
//   {
//     tree: document.getElementById('tree-root'),
//     initialMaxNodes: 10,
//   }
// );
