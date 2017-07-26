import SpeciesVisualisation from 'index';

import data from './data/1';

// One way to instantiate the visualisation:
const visualisation = new SpeciesVisualisation();
visualisation.data = data;
visualisation.tree = document.getElementById('tree-root');
// visualisation.focus = document.getElementById('focus-root');

// Other way to do it:
// const visualisation = new SpeciesVisualisation(
//   data,
//   {
//     tree: document.getElementById('tree-root'),
//   }
// );
