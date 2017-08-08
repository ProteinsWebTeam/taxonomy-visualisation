import { max, tree as d3Tree, select } from 'd3';

// extending d3's defaults
import hierarchy from 'hierarchy';

import { updateFocusSize, updateTreeSize } from 'update-size';
import collapse from 'collapse';
import focus from 'focus';
import toggle from 'toggle';
import getDepthCounts from 'get-depth-counts';
import getMaxDepth from 'get-max-depth';

import draw from 'draw';

const DEFAULT_INITIAL_MAX_NODES = 10;

export default class SpeciesVisualisation {
  constructor(
    data,
    { tree, focus, initialMaxNodes = DEFAULT_INITIAL_MAX_NODES } = {},
  ) {
    this._global = {
      tree: d3Tree(),
      selection: {
        tree: null,
        focus: null,
      },
      initialMaxNodes: +initialMaxNodes || DEFAULT_INITIAL_MAX_NODES,
      instance: this,
    };
    this._listenersPerType = new Map([
      ['click', new Set()],
      ['focus', new Set()],
    ]);
    // call the setters, this is on purpose to share sanity checking logic
    this.data = data;
    this.tree = tree;
    this.focus = focus;

    // bind methods to this instance
    // private
    this._keyDownEventListener = this._keyDownEventListener.bind(this);
    this._eventListenerCommon = this._eventListenerCommon.bind(this);
    // public
    this.redraw = this.redraw.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  // private methods
  _keyDownEventListener(e) {
    switch (e.key) {
      case 'ArrowDown':
        // Focus next sibling
        focus(this._global, this._global.focused.sibling(1));
        this.redraw();
        break;
      case 'ArrowUp':
        // Focus previous sibling
        focus(this._global, this._global.focused.sibling(-1));
        this.redraw();
        break;
      case 'ArrowLeft':
        // Focus parent
        focus(this._global, this._global.focused.parent);
        this.redraw();
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
        this.redraw();
        break;
      case 'Enter':
        toggle(this._global, this._global.focused);
        this.redraw();
        break;
      default:
        return;
    }
  }

  // public methods
  // 'redraw' forces the redrawing of the graphics
  redraw() {
    draw(this._global);
  }

  getDataFromEvent(event) {
    if (!event.target) return null;
    const node = select(event.target).datum();
    if (!node) return null;
    return node.data;
  }

  // getters/setters
  // data
  set data(data) {
    if (Array.isArray(data)) throw new Error('Input data cant be an array');

    this._global.data = data || {};
    this._global.root = hierarchy(this._global.data);
    // Specific cases
    // A hit count has been defined
    if (this._global.root.data.hitcount) {
      this._global.root.sort((a, b) => b.data.hitcount - a.data.hitcount);
    }
    this._global.all = this._global.root.descendants();
    // Initial node collapse
    const maxDepth = getMaxDepth(
      getDepthCounts(this._global.all),
      this._global.initialMaxNodes,
    );
    for (const node of this._global.all) {
      if (node.depth >= maxDepth) collapse(node);
    }

    // Set focus to root
    focus(this._global, this._global.root);

    // Specific cases
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
    if (!element) {
      this._global.selection.tree = null;
      return;
    }
    this._global.selection.tree = select(element).attr('tabindex', 0);
    // move focus according to keyboard
    element.addEventListener('keydown', this._keyDownEventListener);
    // resize according to available size
    updateTreeSize(this._global.selection.tree, this._global);
    // ... and corresponding resizes
    window.addEventListener('resize', () => {
      updateTreeSize(this._global.selection.tree, this._global);
      this.redraw();
    });

    this.redraw();
  }

  get tree() {
    if (this._global.selection.tree) return this._global.selection.tree.node();
  }

  // focus
  set focus(element) {
    if (!element) {
      this._global.selection.focus = null;
      return;
    }
    const root = (this._global.selection.focus = select(element));

    const desc = root
      .append('div')
      .attr('class', 'desc')
      .style('display', 'inline-block');
    desc.append('p').attr('class', 'lineage').append('span').text('Lineage:');
    desc.append('p').attr('class', 'name');
    // Histogram
    root
      .append('svg')
      .attr('class', 'hits')
      .attr('width', 200)
      .attr('height', 100)
      .attr('viewBox', '0 0 200 100')
      .style('float', 'right')
      .style('height', '100%')
      // Background
      .append('rect')
      .attr('class', 'hits-bg')
      .attr('fill', '#fff')
      .attr('width', 200)
      .attr('height', 100);

    // resize according to available size
    updateFocusSize(this._global.selection.focus);

    this.redraw();
  }

  get focus() {
    if (this._global.selection.tree) return this._global.selection.tree.node();
  }

  _eventListenerCommon(type, fun) {
    if (typeof fun !== 'function') throw new Error('Did not pass a function');
    const listeners = this._listenersPerType.get(type);
    if (!listeners) throw new Error(`'${type}' is not a supported event type`);
    return listeners;
  }

  addEventListener(type, fun) {
    const listeners = this._eventListenerCommon(type, fun);
    listeners.add(fun);
  }

  removeEventListener(type, fun) {
    const listeners = this._eventListenerCommon(type, fun);
    listeners.delete(fun);
  }

  cleanup() {
    for (const listeners of this._listenersPerType) listeners.clear();
    // remove references
    this._global.instance = null;
  }
}
