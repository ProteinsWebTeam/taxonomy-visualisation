import drawDescription from './draw-description';
import drawHistogram from './draw-histogram';

export default global => {
  drawDescription(global);
  drawHistogram(global);
};
