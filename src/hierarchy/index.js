import {hierarchy} from 'd3';

hierarchy.prototype.sibling = function(offset) {
  const parent = this.parent;
  if (!parent) return null;
  const siblings = parent.children;
  const index = (siblings.indexOf(this) + offset) % siblings.length;
  return siblings[index];
};

export default hierarchy;
