import { max, tree as d3Tree, select } from 'd3';

// extending d3's defaults
import hierarchy from 'hierarchy';

import updateSize from 'update-size';
import collapse from 'collapse';
import focus from 'focus';
import toggle from 'toggle';

import draw from 'drawTree';

export default class SpeciesVisualisation {
  constructor(data, { tree, focus } = {}) {
    this._global = {
      tree: d3Tree(),
      selection: {
        tree: null,
        focus: null,
      },
    };
    // call the setters, this is on purpose to share sanity checking logic
    this.data = data;
    this.tree = tree;
    this.focus = focus;

    // bind methods to this instance
    this._keyDownEventListener = this._keyDownEventListener.bind(this);
    this.redraw = this.redraw.bind(this);
  }

  // private methods
  _keyDownEventListener(e) {
    switch (e.key) {
      case 'ArrowDown':
        // Focus next sibling
        focus(this._global, this._global.focused.sibling(1));
        draw(this._global);
        break;
      case 'ArrowUp':
        // Focus previous sibling
        focus(this._global, this._global.focused.sibling(-1));
        draw(this._global);
        break;
      case 'ArrowLeft':
        // Focus parent
        focus(this._global, this._global.focused.parent);
        draw(this._global);
        break;
      case 'ArrowRight':
        // If collapsed, open
        if (this._global.focused._children) {
          toggle(this._global, this._global.focused);
        }
        // Focus first child
        focus(
          this._global,
          this._global.focused.children && this._global.focused.children[0],
        );
        draw(this._global);
        break;
      case 'Enter':
        toggle(this._global, this._global.focused);
        draw(this._global);
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  // public methods
  // 'redraw' forces the redrawing of the graphics
  redraw() {
    draw(this._global);
  }

  // getters/setters
  // data
  set data(data) {
    if (Array.isArray(data)) throw new Error('input data cant be an array');

    this._global.data = data || {};
    this._global.root = hierarchy(this._global.data);
    this._global.all = this._global.root.descendants();
    this._global.all.forEach(node => {
      if (node.depth > 2) collapse(node);
    });

    // Set focus to root
    focus(this._global, this._global.root);

    // Specific cases
    // A hit count has been defined
    if (this._global.root.data.hitcount) {
      this._global.root.sort((a, b) => b.data.hitcount - a.data.hitcount);
    }
    // A hit distribution has been defined
    if (
      this._global.root.data.hitdist &&
      this._global.root.data.hitdist.length
    ) {
      this._global.maxCountBin = max(this._global.all, node =>
        max(node.data.hitdist),
      );
      this._global.nBins = this._global.root.data.hitdist.length;
    }
  }

  get data() {
    return this._global.data;
  }

  // tree
  set tree(element) {
    if (!element) return;
    this._global.selection.tree = select(element).attr('tabindex', 0);
    // move focus according to keyboard
    element.addEventListener('keydown', this._keyDownEventListener);
    // resize according to window size
    updateSize(this._global, this._global.selection.tree);
    // ... and corresponding resizes
    window.addEventListener('resize', () => {
      updateSize(this._global, this._global.selection.tree);
      draw(this._global);
    });

    draw(this._global);
  }

  get tree() {
    if (this._global.select.tree) return this._global.select.tree.node();
  }

  // focus
  set focus(element) {
    if (!element) return;
    this._global.selection.focus = select(element);
    draw(this._global);
  }

  get focus() {
    if (this._global.select.tree) return this._global.select.tree.node();
  }
}
