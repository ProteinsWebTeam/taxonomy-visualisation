import SpeciesVisualisation from 'index';

import data from './data/1';

// One way to instantiate the visualisation:
const visualisation = new SpeciesVisualisation(data);
// visualisation.data = data;
visualisation.tree = document.getElementById('tree-root');
visualisation.focus = document.getElementById('focus-root');

visualisation.addEventListener('focus', event => {
  console.log('focus event', event.target, event.detail);
});

// Other way to do it:
// const visualisation = new SpeciesVisualisation(
//   data,
//   {
//     tree: document.getElementById('tree-root'),
//   }
// );
