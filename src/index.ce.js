import _TaxonomyVisualisation from './taxonomy-visualisation';

export const TaxonomyVisualisation = _TaxonomyVisualisation;

class TaxonomyVisualisationElement extends HTMLElement {
  static get is() {
    return 'taxonomy-visualisation';
  }

  static get observedAttributes() {
    return ['fisheye'];
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
    if (name === 'fisheye' && this._visualisation.fisheye === !!newValue) {
      this._visualisation.fisheye = !!newValue;
    }
  }

  disconnectedCallback() {
    this.removeEventListener('load', this._loadListener);
    this._visualisation.cleanup();
  }

  render() {
    if (!this._svg) {
      this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this._svg.style.display = 'block';
      this._svg.style.width = '100%';
      this._svg.style.height = '100%';
      this.appendChild(this._svg);
    }
    if (!this._visualisation) {
      const initialMaxNodes = this.getAttribute('initial-max-nodes');
      const enableZooming = this.hasAttribute('enable-zooming');
      const fisheye = this.hasAttribute('fisheye');
      this._visualisation = new TaxonomyVisualisation(null, {
        initialMaxNodes,
        fisheye,
        enableZooming,
      });
      this._visualisation.addEventListener('click', this.dispatchEvent);
      this._visualisation.addEventListener('focus', this.dispatchEvent);
    }
    this._visualisation.tree = this._svg;
    const focusId = this.getAttribute('focus-id') || null;
    if (focusId) {
      this._visualisation.focus = document.getElementById(focusId);
    }
  }

  get data() {
    return this._visualisation.data;
  }

  set data(data) {
    this._visualisation.data = data;
  }

  get fisheye() {
    return this._visualisation.fisheye;
  }

  set fisheye(value) {
    const _value = !!value;
    if (this._visualisation.fisheye === _value) return;
    this._visualisation.fisheye = _value;
    if (_value) {
      this.setAttribute('fisheye', '');
    } else {
      this.removeAttribute('fisheye');
    }
    this.dispatchEvent(new CustomEvent('change', { detail: _value }));
  }

  toggleFisheye() {
    return (this.fisheye = !this.fisheye);
  }

  _loadListener(e) {
    this._visualisation.data = e.detail.payload;
  }
}

const loadComponent = () =>
  customElements.define('taxonomy-visualisation', TaxonomyVisualisationElement);

// Conditional waiting for polyfill
if (window.customElements) {
  loadComponent();
} else {
  document.addEventListener('WebComponentsReady', loadComponent, {
    once: true,
  });
}

export default TaxonomyVisualisationElement;
