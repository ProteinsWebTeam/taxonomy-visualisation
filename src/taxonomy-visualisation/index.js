import { max, tree as d3Tree, select } from 'd3';

// extending d3's defaults
import hierarchy from '../hierarchy';

import { updateFocusSize, updateTreeSize, updateWidth } from '../update-size';
import addZoominPanning, { resetZooming } from '../zooming';
import collapse from '../collapse';
import focus from '../focus';
import toggle from '../toggle';
import getDepthCounts from '../get-depth-counts';
import getMaxDepth from '../get-max-depth';

import draw from '../draw';

const DEFAULT_INITIAL_MAX_NODES = 10;

const DEFAULT_CLASSNAMES = {
  ancestor: 'ancestor',
  arrow: 'arrow',
  bin: 'bin',
  focusRing: 'focus-ring',
  focused: 'focused',
  hits: 'hits',
  hitsBg: 'hits-bg',
  inPath: 'in-path',
  label: 'label',
  link: 'link',
  name: 'name',
  node: 'node',
};

export default class TaxonomyVisualisation {
  constructor(
    data,
    {
      tree,
      focus,
      initialMaxNodes = DEFAULT_INITIAL_MAX_NODES,
      fixedNodeSize = false,
      fisheye = false,
      classnames = {},
      shouldCorrectNodesOutside = false,
      enableZooming = false,
      useCtrlToZoom = false,
      searchTerm = '',
    } = {}
  ) {
    this._global = {
      tree: d3Tree(),
      selection: {
        tree: null,
        focus: null,
      },
      initialMaxNodes: +initialMaxNodes || DEFAULT_INITIAL_MAX_NODES,
      instance: this,
      fixedNodeSize,
      fisheye,
      shouldCorrectNodesOutside,
      enableZooming,
      useCtrlToZoom,
      searchTerm,
      classnames: Object.assign({}, DEFAULT_CLASSNAMES, classnames),
      scale: 1,
      margin: 20,
    };
    this._listenersPerType = new Map([
      ['click', new Set()],
      ['focus', new Set()],
    ]);
    // call the setters, this is on purpose to share sanity checking logic
    this.data = data;
    this.tree = tree;
    this.focus = focus;

    // Observer for a direct change in the width attibute of the svg
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'width' &&
          this._global?.selection?.tree
        ) {
          const width = Number(mutation.target.getAttribute('width'));
          updateWidth(width, this._global);
          this.redraw();
        }
      });
    });

    // bind methods to this instance
    // private
    this._keyDownEventListener = this._keyDownEventListener.bind(this);
    this._eventListenerCommon = this._eventListenerCommon.bind(this);
    // public
    this.redraw = this.redraw.bind(this);
    this.focusNodeWithID = this.focusNodeWithID.bind(this);
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.cleanup = this.cleanup.bind(this);
  }

  // private methods
  _keyDownEventListener(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // Focus next sibling
        focus(this._global, this._global.focused.sibling(1));
        this.redraw();
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Focus previous sibling
        focus(this._global, this._global.focused.sibling(-1));
        this.redraw();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        // Focus parent
        focus(this._global, this._global.focused.parent);
        this.redraw();
        break;
      case 'ArrowRight':
        e.preventDefault();
        // If collapsed, open
        if (this._global.focused._children) {
          toggle(this._global, this._global.focused);
        }
        // Focus first child
        focus(
          this._global,
          this._global.focused.children && this._global.focused.children[0]
        );
        this.redraw();
        break;
      case 'Enter':
        e.preventDefault();
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
      this._global.initialMaxNodes
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
      this._global.maxCountBin = max(this._global.all, (node) =>
        max(node.data.hitdist)
      );
      this._global.nBins = this._global.root.data.hitdist.length;
    }

    this.redraw();
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
    if (element.tagName.toLowerCase() !== 'svg') {
      throw new Error('Root element for the tree needs to be an SVG element');
    }
    this._global.selection.tree = select(element).attr('tabindex', 0);
    this._global.svg = element;

    // move focus according to keyboard
    element.addEventListener('keydown', this._keyDownEventListener.bind(this));
    // resize according to available size
    updateTreeSize(this._global.selection.tree, this._global);
    // ... and corresponding resizes
    window.addEventListener('resize', () => {
      updateTreeSize(this._global.selection.tree, this._global);
      this.redraw();
    });

    this.observer.observe(element, { attributes: true });
    if (this._global.enableZooming)
      addZoominPanning(this._global.selection.tree, this._global);

    this.redraw();
  }
  resetZoom() {
    if (this._global.enableZooming)
      resetZooming(this._global.selection.tree, this._global);
  }

  get tree() {
    return this._global.selection.tree
      ? this._global.selection.tree.node()
      : undefined;
  }

  // focus
  set focus(element) {
    if (!element) {
      this._global.selection.focus = null;
      return;
    }
    // Replace possible loading elements
    for (const child of element.children) {
      element.removeChild(child);
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
    return this._global.selection.tree
      ? this._global.selection.tree.node()
      : undefined;
  }

  set fisheye(value) {
    const _value = !!value;
    if (this._global.fisheye !== _value) {
      this._global.fisheye = _value;
      this.redraw();
    }
  }

  get fisheye() {
    return this._global.fisheye;
  }

  set searchTerm(value) {
    if (this._global.searchTerm !== value) {
      this._global.searchTerm = value;
      this.redraw();
    }
  }

  get searchTerm() {
    return this._global.searchTerm;
  }

  _eventListenerCommon(type, fun) {
    if (typeof fun !== 'function') throw new Error('Did not pass a function');
    const listeners = this._listenersPerType.get(type);
    if (!listeners) throw new Error(`'${type}' is not a supported event type`);
    return listeners;
  }

  focusNodeWithID(id) {
    // Try to find the node with the corresponding ID
    const toBeFocused = this._global.all.find((node) => node.data.id === id);
    // Just returns without doing anything if didn't find
    if (!toBeFocused) return;
    // Set focus to found node
    focus(this._global, toBeFocused);
  }

  addEventListener(type, fun) {
    const listeners = this._eventListenerCommon(type, fun);
    listeners.add(fun);
    return fun;
  }

  removeEventListener(type, fun) {
    const listeners = this._eventListenerCommon(type, fun);
    listeners.delete(fun);
  }

  cleanup() {
    for (const [, listeners] of this._listenersPerType) listeners.clear();
    this._listenersPerType.clear();
    this.observer.disconnect();
    // remove references
    this._global.instance = null;
  }
}
