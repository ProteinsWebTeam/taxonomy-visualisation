import TaxonomyVisualisation from './taxonomy-visualisation';

class TaxonomyVisualisationElement extends HTMLElement {
  static get observedAttributes() {
    return ['fisheye', 'initial-max-nodes'];
  }

  constructor() {
    super();

    this._loadListener = this._loadListener.bind(this);
  }

  connectedCallback() {
    this.render();
    const dataLoader = this.querySelector('data-loader');
    if (dataLoader && dataLoader.data) {
      this._visualisation.data = dataLoader.data;
    }
    this.addEventListener('load', this._loadListener);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._visualisation) return;
    if (name === 'initial-max-nodes') {
      this._visualisation.initialMaxNodes = newValue;
    }
    if (name === 'fisheye') {
      this._visualisation.fisheye = !!newValue;
    }
  }

  disconnectedCallback() {
    this.removeEventListener('load', this._loadListener);
  }

  render() {
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.style.display = 'block';
    this._svg.style.width = '100%';
    this._svg.style.height = '100%';
    this.appendChild(this._svg);
    const initialMaxNodes = this.getAttribute('initial-max-nodes') || 10;
    const fisheye = this.hasAttribute('fisheye');
    this._visualisation = new TaxonomyVisualisation(null, {
      initialMaxNodes,
      fisheye,
    });
    this._visualisation.tree = this._svg;
    const focusId = this.getAttribute('focus-id') || null;
    if (focusId) {
      this._visualisation.focus = document.getElementById(focusId);
    }
  }

  set data(data) {
    this._visualisation.data = data;
  }

  set fisheye(value) {
    this._visualisation.fisheye = value;
  }

  get fisheye() {
    return this._visualisation.fisheye;
  }

  _loadListener(e) {
    this._visualisation.data = e.detail.payload;
  }
}

const loadComponent = function() {
  customElements.define('taxonomy-visualisation', TaxonomyVisualisationElement);
};

// Conditional loading of polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener('WebComponentsReady', function() {
    loadComponent();
  });
}

export default TaxonomyVisualisation;
