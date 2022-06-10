import { hierarchy } from 'd3-hierarchy';

hierarchy.prototype.sibling = function (offset) {
  const parent = this.parent;
  if (!parent) return null;
  const siblings = parent.children;
  const indexTmp = siblings.indexOf(this) + offset + siblings.length;
  return siblings[indexTmp % siblings.length];
};

export default hierarchy;
