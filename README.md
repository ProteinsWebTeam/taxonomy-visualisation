[![Build Status](https://travis-ci.org/ProteinsWebTeam/taxonomy-visualisation.svg?branch=master)](https://travis-ci.org/ProteinsWebTeam/taxonomy-visualisation)
[![npm version](https://badge.fury.io/js/taxonomy-visualisation.svg)](https://www.npmjs.com/package/taxonomy-visualisation)
[![Coverage Status](https://coveralls.io/repos/github/ProteinsWebTeam/taxonomy-visualisation/badge.svg?branch=master)](https://coveralls.io/github/ProteinsWebTeam/taxonomy-visualisation?branch=master)

# Taxonomy visualisation, library

_in development_

This part is to use as a JavaScript library, if you want to use this visualisation as a custom element see lower in this readme.

## Usage

### Install the library

This library is available on npm as `taxonomy-visualisation`.

See it running [Here](https://proteinswebteam.github.io/taxonomy-visualisation/).

To install, run `npm install --save taxonomy-visualisation`.

### Load the library

#### Using ES modules (modern approach)

```js
import TaxonomyVisualisation from 'taxonomy-visualisation';
```

#### Using a global script tag (legacy approach)

```html
<script async src="<path_to_library>/dist/taxonomy-visualisation-main.js"></script>
```

Or using unpkg CDN (not recommend for production), see usage
[here](https://unpkg.com/)

```html
<script async src="https://unpkg.com/taxonomy-visualisation"></script>
```

Those will make the library available globally on `window.TaxonomyVisualisation`

If D3 is already present in your page, you can use the
`taxonomy-visualisation-main-without-d3.js` file to avoid loading D3 multiple times
and thus load a smaller file to use this library.

### Example

_see `example` folder for more examples_

Given the following document:

```html
<main>
  <div id="focus-root"></div>
  <svg id="tree-root"></svg>
</main>
```

One way to instantiate this library with data stored in the `data` variable
could be like this:

```js
// Create the instance with data and options
const visualisation = new TaxonomyVisualisation(data, { initialMaxNodes: 10 });

// Or the data could be updated later like in the following comment
// visualisation.data = data;

// Connect the instance to DOM elements
visualisation.tree = document.getElementById('tree-root');
visualisation.focus = document.getElementById('focus-root');

// Hook up the events emitted by the instance to some custom logic
visualisation.addEventListener('focus', event => {
  console.log('custom focus event', event.detail);
});

visualisation.focus.addEventListener('click', event =>
  console.log(visualisation.getDataFromEvent(event))
);
```

Or like this:

```js
const visualisation = new SpeciesVisualisation(data, {
  tree: document.getElementById('tree-root'),
  focus: document.getElementById('focus-root'),
  initialMaxNodes: 10,
});
```

#### Dynamic example

To play with a dynamic example, you can clone this repository

`git clone https://github.com/ProteinsWebTeam/taxonomy-visualisation.git`

go into the resulting folder

`cd taxonomy-visualisation`

install the dependencies

`npm install`

then run the example with

`npm run start`

and open the page whose URL is displayed in the console

## API

The only, and default, export from this library is the `TaxonomyVisualisation`
class.

The `TaxonomyVisualisation()` constructor creates a new TaxonomyVisualisation

### Syntax

```js
const visualisation = new TaxonomyVisualisation(data, options);
```

#### values

- data:

  a `Data` object, of the type `Node` as defined here:

```flow js
type Node = {
  id: string | number,// unique in the whole tree (tax id)
  name: string,// name displayed
  children?: Array<Node>,
  hitdist?: Array<number>,// distribution of hits
  hitcount?: number,// number of hits
};
```

Note that all the `hitdist` arrays should have the same length throughout the
tree.

All of the keys will be kept and made available as a Node's data. You can
store more information that the one required to draw the tree.

- options: (optional)

  - tree: (optional, default: `undefined`.)

    a [`SVGSVGElement`](https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement) (`<svg></svg>`) to display the tree visualisation into.

  - focus: (optional, default: `undefined`)

    a [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)to display the focus information into.

  - initialMaxNodes: (optional, default: `10`)

    a positive `number` corresponding to the maximum number of node to display at once for the initial load. For example if the number of nodes from the root to the depth of 2 is 8, but the number of nodes from the root to the depth of 3 is 11, then only display up to the level of 2. all the nodes at this second level will be collapsed and none of their children will be displayed by default. `+Infinity` is a valid value, and will display all of the nodes in the tree.

  - fisheye: (optional, default: `false`)

    a boolean representing if the fisheye view will be activated or not on instantiation. It can still be modified after through the instance's `fisheye` attribute.

  - classnames: (optional)

    A map of classnames to use instead of the defaults. Can be useful if using [css-modules](https://github.com/css-modules/css-modules) for example.

    - ancestor: (optional, default: `'ancestor'`)

      applied to all parent nodes in the focus view (including the focused node)

    - arrow: (optional, default: `'arrow'`)

      the arrow used to communicate that there are collapsed children

    - bin: (optional, default: `'bin'`)

      every bar used in the histogram

    - focusRing: (optional, default: `'focus-ring'`)

      the ring used to show the currently focused node

    - focused: (optional, default: `'focused'`)

      applied only on the focused node

    - hits: (optional, default: `'hits'`)

      applied to the histogram container

    - hitsBg: (optional, default: `'hits-bg'`)

      applied to the histogram background

    - inPath: (optional, default: `'in-path'`)

      applied to all the nodes and paths either parents or children of the focused node (including the focused node)

    - label: (optional, default: `'label'`)

      text group displaying the name of a node and the arrow if needed

    - link: (optional, default: `'link'`)

      path between 2 nodes

    - name: (optional, default: `'name'`)

      text displaying the name of a node

    - node: (optional, default: `'node'`)

      node on screen

#### methods

- `redraw(): void`

  Forces redrawing the whole tree.

- `getDataFromEvent(event: Event): Node`

  Given an event returned by one of the event listeners, returns the data
  corresponding to the node that emitted the event.

- `focusNodeWithID(id: string | number): void`

  Given an ID, focus the node with the corresponding ID, if it exists.

- `addEventListener(type: 'click' | 'focus', fun: Event => void): Event => void`

  Add an event listener for a specific event (`focus` or `click`). The callback
  function will be called with an `Event` object. `getDataFromEvent` can be
  used with this `Event`. Return the callback function passed as an input, to
  keep a reference to it to later remove it with `removeEventListener`.

- `removeEventListener(type: 'click' | 'focus', fun: Event => void): void`

  Remove an event listener previously added with `addEventListener`.

- `cleanup(): void`

  Clean up all the event listeners, and detach all external references inside
  the instance to avoid memory leaks.

#### attributes

- `data: Node` (read-write)

  Data associated with this instance of the visualisation.

- `tree: SVGSVGElement` (read-write)

  SVG DOM Element containing the tree visualisation.

- `focus: HTMLElement` (read-write)

  DOM Element containing the focus visualisation.

- `fisheye: Boolean` (read-write)

  Status of the fisheye mode to have a better view of the focused node.

# Taxonomy visualisation, Custom Element implementation

## Usage

### Install the library

This library is available on npm as `taxonomy-visualisation`.

See it running [Here](https://proteinswebteam.github.io/taxonomy-visualisation/).

To install, run `npm install --save taxonomy-visualisation`.

### Load the library

#### Using ES modules

```js
import TaxonomyVisualisationElement, {
  TaxonomyVisualisation,
} from 'taxonomy-visualisation/dist/taxonomy-visualisation-ce.js';
```

#### Using a global script tag

```html
<script async src="<path_to_library>/dist/taxonomy-visualisation-ce.js"></script>
```

Or using unpkg CDN (not recommend for production), see usage
[here](https://unpkg.com/)

```html
<script async src="https://unpkg.com/taxonomy-visualisation/dist/taxonomy-visualisation-ce.js"></script>
```

If D3 is already present in your page, you can use the
`taxonomy-visualisation-ce-without-d3.js` file to avoid loading D3 multiple times
and thus load a smaller file to use this library.

### Example

_see `example` folder for more examples_

Given the following document:

```html
<main>
  <div id="focus-root"></div>
  <svg id="tree-root"></svg>
  <taxonomy-visualisation
    id="tree-root"
    focus-id="focus-root"
    initial-max-nodes="10"
  >
</main>
```

One way to instantiate this library with data stored in the `data` variable
could be like this:

```js
// Create the instance with data and options
const visualisation = (document.querySelector('#tree-root').data = data);

// Hook up the events emitted by the instance to some custom logic
visualisation.addEventListener('focus', event => {
  console.log('custom focus event', event.detail);
});
```

#### Dynamic example

To play with a dynamic example, you can clone this repository

`git clone https://github.com/ProteinsWebTeam/taxonomy-visualisation.git`

go into the resulting folder

`cd taxonomy-visualisation`

install the dependencies

`npm install`

then run the example with

`npm run start`

and open the page whose URL is displayed in the console and add `/index_ce.html` at the end of the URL.

## API

The only default export from this library is the `TaxonomyVisualisationElement`
class that you can use to define a custom element tag name. By default it will assign it to `taxonomy-visualisation`.

Additionally, a named export make the `TaxonomyVisualisation` class available. See the beginning of this readme for instructions on how to use the JavaScript library.

### Syntax

A minimum syntax could be:

```html
<taxonomy-visualisation>
```

and that's it.

#### methods

Additionally to a normal `HTMLElement`, a `TaxonomyVisualisationElement` exposes:

- `toggleFisheye(): Boolean`

  Toggles the fisheye mode. returns the mode's new value.

#### events

Additionally to a normal `HTMLElement`, a `TaxonomyVisualisationElement` may fire events of type `click` (when a node is clicked in the visualisation), `focus` (when the focused node changes), or `change` (when the fisheye mode changes).

To load data into the visualisation, it will also listen for `load` events coming from below in the DOM tree. You can use in combination with the `<data-loader>` custom element (see [`data-loader` library](https://www.npmjs.com/package/data-loader)). You can look at the custom element example for how to use it in combination.

#### properties

Additionally to a normal `HTMLElement`, a `TaxonomyVisualisationElement` exposes:

- `data: Node` (read-write)

  Data associated with this instance of the visualisation.

- `fisheye: Boolean` (read-write)

  Status of the fisheye mode to have a better view of the focused node.

#### attributes

Additionally to a normal `HTMLElement`, a `TaxonomyVisualisationElement` accepts:

- `initial-max-nodes` (only used on instantiation)

- `focused` (in-sync with the `focused` property)

  Presence or absence denote activation or not of the fisheye mode.
