# Segmented Control

Segmented Control has two types. **Segmented Control Nav** & **Segmented Control Input**. The main difference is that the "input" version doesn't have panel content and tries to recreate the functionality of a `radiogroup`. This component is very similar to a Tabcordion, but instead of turning into an Accordion on mobile breakpoints the triggers turn into a native `select`.

#### Table of Contents
1. [Setup](#setup)
2. [Javascript Options](#javascript-options)
3. [Methods](#methods)
4. [Design Notes](#design-notes)
5. [Usage](#usage)

## Setup

The main points to take notice of for a Segmented Control are:

* `data-seg-ctrl-trigger` - the element used to activate panels or change the value.
* `data-seg-ctrl-panel-holder` - container used to "hold panels" in the "nav" version.
* `data-seg-ctrl-panel` - container for content which is activated/deactivated in the "nav" version.
* `data-seg-ctrl-select` - a select box that has a value of the active trigger. The Segmented Control triggers hide `medium` down and the `select` takes over.
* A trigger can be disabled by applying `.disabled`. If the `[disabled]` attribute isn't applied to the corresponding `select` `option` the javascript component will add it.

### Segmented Control Input

Primarily used as a form input.

```html
<div class="segmented-ctrl-input" data-seg-ctrl-input>
  <nav class="segmented-ctrl-input-items hide-md-down" role="radiogroup">
    <a aria-controls="seg-month-select" aria-selected="true" class="segmented-ctrl-trigger active-item" data-seg-ctrl-trigger="10" href="#" role="radio">10</a>
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger " data-seg-ctrl-trigger="20" href="#" role="radio">20</a>

    <!-- Example of a disabled trigger -->
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger disabled" data-seg-ctrl-trigger="30" href="#" role="radio">30</a>

    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger" data-seg-ctrl-trigger="40" href="#" role="radio">40</a>
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger " data-seg-ctrl-trigger="50" href="#" role="radio">50</a>
  </nav>
  <div class="segmented-ctrl-select hide-lg-up">
    <select name="seg-month-select" id="seg-month-select" data-seg-ctrl-select>
      <option value="10">10 Months</option>
      <option value="20">20 Months</option>
      <option value="30">30 Months</option>
      <option value="40">40 Months</option>
      <option value="50">50 Months</option>
    </select>
  </div>
</div>
```

### Segmented Control Navigation

Mostly used as a navigation scheme inside of a tab/accordion panel.

```html
<div class="segmented-ctrl-nav" data-seg-ctrl-nav>
  <nav class="segmented-ctrl-nav-items hide-md-down" role="tablist">
    <a aria-controls="first-panel" aria-expanded="true" aria-selected="true" class="segmented-ctrl-trigger active-item" data-seg-ctrl-trigger="first-panel" data-track-elem="tab" data-track-name="First Link" data-track-trigger="switch" href="#" id="first-panel-label" role="tab">First Link</a>
    <a aria-controls="second-panel" aria-expanded="false" aria-selected="false" class="segmented-ctrl-trigger" data-seg-ctrl-trigger="second-panel" data-track-elem="tab" data-track-name="Second Link" data-track-trigger="switch" href="#" id="second-panel-label" role="tab">Second Link</a>
    <a aria-controls="third-panel" aria-expanded="false" aria-selected="false" class="segmented-ctrl-trigger" data-seg-ctrl-trigger="third-panel" data-track-elem="tab" data-track-name="Third Link" data-track-trigger="switch" href="#" id="third-panel-label" role="tab">Third Link</a>
  </nav>
  <div class="segmented-ctrl-select hide-lg-up">
    <select name="segmented-control-nav" data-seg-ctrl-select>
      <option value="first-panel">First Link</option>
      <option value="second-panel">Second Link</option>
      <option value="third-panel">Third Link</option>
    </select>
  </div>
  <div class="segmented-ctrl-nav-panels sm-pad-t3" data-seg-ctrl-panel-holder>
    <div aria-hidden="false" class="segmented-ctrl-nav-content active-item" data-seg-ctrl-panel="first-panel" id="first-panel" role="tabpanel"></div>
    <div aria-hidden="true" class="segmented-ctrl-nav-content" data-seg-ctrl-panel="second-panel" id="second-panel" role="tabpanel"></div>
    <div aria-hidden="true" class="segmented-ctrl-nav-content" data-seg-ctrl-panel="third-panel" id="third-panel" role="tabpanel"></div>
  </div>
</div>
```


### Javascript Initialization

Pass in the main container (most likely `.segemented-ctrl-nav` or `.segemented-ctrl-input`). A listener for triggers is delegated from `body` so you can active panels from anywhere on the page. Even from another panel. The only requirement for a trigger is that it has the proper data attribute (`[data-seg-ctrl-trigger]`) and that the value of it points to the panel (`data-seg-ctrl-panel`) it should open.

```javascript
/**
	Simplest initialization. Select your container and pass
	it in with any options if you have any. Also now the variable "segCtrlNav"
	stores the instance of the dialog and can run it's methods directly.
**/
const segCtrlNav = new momappoki.components.SegementedCtrl($('.segemented-ctrl-nav'), { [your options] });

/**
	To intialize a Segmented Control Input
**/
const segCtrlInput = new momappoki.components.SegementedCtrl($('.segmented-ctrl-input'), { type: 'input', [your options] });

/**
	Need to save references for control in your javascript?
	This will give you an object with keys that relate to the container ID's
	and can set the active item programatically.
**/

const allTheCtrls = $('[data-generic-ctrl-selector]').toArray().reduce((obj, el) => {
	const $el = $(el);

	obj[$el.attr('id')] = new momappoki.components.SegmentedCtrl($el);

	return obj;
}, {});

/**
	Result:

	allTheCtrls = {
		'ctrl-1': SegmentedCtrl instance,
		'ctrl-2': SegmentedCtrl instance,
		'ctrl-3': SegmentedCtrl instance
	}

	Run something.

	allTheCtrls['ctrl-1'].setActive('some-panel-id');
**/

```

## Javascript Options

##### selectNavBP
The breakpoint that the triggers turn into a `select`. So the default of `'medium'` would turn tabs into an accordion from the medium breakpoint down.

Type: `string`  
Default: `'medium'`


##### type
Sets the type of component to initialize. If set to `'input'` the component will recreate the functionality of a `radiogroup`.

Type: `string`  
Default: `'nav'`  
Options: `'nav'`, `'input'`

##### onActive
Callback function fired when a new panel is activated.

Type: `function`  
Default: `$.noop`  
Arguments: `activeID`, `this`

##### onInactive
Callback function fired when a panel is deactivated.

Type: `function`  
Default: `$.noop`  
Arguments: `inactiveID`, `this`

##### onChange
Callback function fired when any change occurs.

Type: `function`  
Default: `$.noop`  
Arguments: `activeIDs` (Active panel ID or array of IDs if they exist), `inactiveIDs` (Inactive panel ID or array of IDs if they exist), `this`

##### onEnterKey
Callback function fired when `enter` is pressed while on a trigger. The `id` passed in the trigger id of the trigger the user is on.

Type: `function`  
Default: `$.noop`  
Arguments: `id`, `this`

##### onArrowKey
Callback function fired when a directional key is pressed while on a trigger. The `id` passed in the trigger id of the trigger the user is on.

Type: `function`  
Default: `$.noop`  
Arguments: `key`, `id`, `nextIdx`, `this`

##### onKey
Callback function fired when any key is pressed while on a trigger. `e` is the event data. The event data can be used in combination with our `convertKeyCode` utility, for example. The `id` passed in the trigger id of the trigger the user is on.

Type: `function`  
Default: `$.noop`  
Arguments: `e`, `key`, `id`, `nextIdx`, `this`


## Methods

##### setActive
Used to programmatically set an active panel. Pass one panel ID at a time.

```js
mySavedCtrl.setActive('whatever-panel');
```

## Javascript Template

A Segemented Control can be created with an object using the available javascript templates. Individual template elements can also be generated. Each returns a cached Lodash template. You should **never** build a component yourself with javascript as the HTML it generates could get out of sync with the standard.

```js
momappoki.templates.segmentedCtrl = {
	base,
	navTrigger,
	items,
	inputBtn,
	select,
	panels
};

/**
	Initialize a template - default is "nav" type. Pass "input" for the input type.
	To exclude the Segmented Control wrapper element pass "false" (boolean) to the base template.
**/
const mySegCtrl = momappoki.templates.segmentedCtrl.base();

// Rendered HTML
mySegCtrl(dataObject);

//or

momappoki.templates.segmentedCtrl.base()(dataObject);
```

### Template Data Structure

```js
/**
{
  modifiers: '',
  attrs: {},
  items: [
    {
      attrs: {},
      active: false, // (optional) or set true on the starting panel
      id: '', // used to connect triggers to panels,
      modifiers: '',
      trigger: {
        text: '',
        attrs: {},
        modifiers, '', // space separated class names
        trackName: ''
      },
      panel: {
        content: '', // html or just text
        attrs: {},
        modifiers, '' // space separated class names
      }
    }
  ]
}
**/
```

## Design Notes


### When To Use This Pattern

Segmented Controls can be used:

* To display options that may commonly be hidden in a select list
* As low profile progressive disclosure, nested within a container

### Best Practices

* Use at least two segments and avoid more than seven as it may overwhelm the user
* Text inside segments should not vary greatly so it appears uniform
* Selected segments should be clearly identified and visually distinct from those that are inactive

### How it Works

* Depending on its use, one segment may be pre-selected or all should be inactive on load
* Only one segment may be active at a time
* If necessary, on medium and small breakpoints, segmented controls are displayed as select lists

### Structure

* Segment sizes derive from standard button and field specifications while it’s style mirrors the pagination control
* A label (legend) may be associated with a segmented control and should be centered or left aligned above the segments
* Overall alignment is informed by surrounding content but is commonly centered or left aligned to parent elements
* When used within a form:
	* Segments remain square so they resemble and align to input fields and other form controls
	* Segments should have a consistent width, size is determined by the total size of the container
	* When used as a progressive disclosure:
	* Segments are rounded so they appear visually distinct from buttons and form controls
	* Segments maintain the same padding and the length is determined by the label (like a button)


## Usage

#### Segmented Control Input

```html
<div class="segmented-ctrl-input" data-seg-ctrl-input>
  <nav class="segmented-ctrl-input-items hide-md-down">
    <a aria-controls="seg-month-select" aria-selected="true" class="segmented-ctrl-trigger active-item" data-seg-ctrl-trigger="10" href="#" role="radio">10</a>
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger " data-seg-ctrl-trigger="20" href="#" role="radio">20</a>
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger disabled" data-seg-ctrl-trigger="30" href="#" role="radio">30</a>
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger disabled" data-seg-ctrl-trigger="40" href="#" role="radio">40</a>
    <a aria-controls="seg-month-select" aria-selected="false" class="segmented-ctrl-trigger " data-seg-ctrl-trigger="50" href="#" role="radio">50</a>
  </nav>
  <div class="segmented-ctrl-select hide-lg-up">
    <select name="seg-month-select" id="seg-month-select" data-seg-ctrl-select>
      <option value="10">10 Months</option>
      <option value="20">20 Months</option>
      <option value="30">30 Months</option>
      <option value="40">40 Months</option>
      <option value="50">50 Months</option>
    </select>
  </div>
</div>
```

#### Segmented Control Navigation

```html
<div class="segmented-ctrl-nav" data-seg-ctrl-nav>
  <nav class="segmented-ctrl-nav-items hide-md-down">
    <a aria-controls="first-panel" aria-expanded="true" aria-selected="true" class="segmented-ctrl-trigger active-item" data-seg-ctrl-trigger="first-panel" data-track-elem="tab" data-track-name="First Link" data-track-trigger="switch" href="#" id="first-panel-label" role="tab">First Link</a>
    <a aria-controls="second-panel" aria-expanded="false" aria-selected="false" class="segmented-ctrl-trigger" data-seg-ctrl-trigger="second-panel" data-track-elem="tab" data-track-name="Second Link" data-track-trigger="switch" href="#" id="second-panel-label" role="tab">Second Link</a>
    <a aria-controls="third-panel" aria-expanded="false" aria-selected="false" class="segmented-ctrl-trigger" data-seg-ctrl-trigger="third-panel" data-track-elem="tab" data-track-name="Third Link" data-track-trigger="switch" href="#" id="third-panel-label" role="tab">Third Link</a>
  </nav>
  <div class="segmented-ctrl-select hide-lg-up">
    <select name="segmented-control-nav" data-seg-ctrl-select>
      <option value="first-panel">First Link</option>
      <option value="second-panel">Second Link</option>
      <option value="third-panel">Third Link</option>
    </select>
  </div>
  <div class="segmented-ctrl-nav-panels sm-pad-t3" data-seg-ctrl-panel-holder>
    <div aria-hidden="false" class="segmented-ctrl-nav-content active-item" data-seg-ctrl-panel="first-panel" id="first-panel" role="tabpanel">
      <p class="sm-pad-b2">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p class="sm-pad-b2">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
    <div aria-hidden="true" class="segmented-ctrl-nav-content" data-seg-ctrl-panel="second-panel" id="second-panel" role="tabpanel">
      <h2 tabindex="-1">Something</h2>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
    <div aria-hidden="true" class="segmented-ctrl-nav-content" data-seg-ctrl-panel="third-panel" id="third-panel" role="tabpanel">
      <p class="sm-pad-b2">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p class="sm-pad-b2">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
  </div>
</div>
```


