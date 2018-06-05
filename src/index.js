import TaxonomyVisualisation from './taxonomy-visualisation';

class TaxonomyVisualisationElement extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  static get observedAttributes() {
    return ['enable-fisheye', 'initial-max-nodes'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (!this._visualisation) return;
    if (name === 'initial-max-nodes') {
      this._visualisation.initialMaxNodes = newValue;
    }
    if (name === 'enable-fisheye') {
      this._visualisation.enableFisheye = !!newValue;
    }
  }
  render() {
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.style.display = 'block';
    this._svg.style.width = '100%';
    this._svg.style.height = '100%';
    this.appendChild(this._svg);
    const initialMaxNodes = this.getAttribute('initial-max-nodes') || 10;
    const enableFisheye = this.hasAttribute('enable-fisheye');
    this._visualisation = new TaxonomyVisualisation(null, {
      initialMaxNodes,
      enableFisheye,
    });
    this._visualisation.tree = this._svg;
    const focusId = this.getAttribute('focus-id') || null;
    if (focusId) {
      this._visualisation.focus = document.getElementById(focusId);
    }
    this.addEventListener('load', e => {
      this._visualisation.data = e.detail.payload;
    });
  }
  set data(data) {
    this._visualisation.data = data;
  }
  set enableFisheye(value) {
    this._visualisation.enableFisheye = value;
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
