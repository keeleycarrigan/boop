# Tabcordion

Tabs, accordingly.

This component runs both accordion and tab components. The latter turning into an accordion at smaller breakpoints. The javascript portion of this component is an extension of our `BaseTabs` class and adds the ability for tabs to turn into an accordion. We accomplish this by tying the core units of both components together using data attributes with unique values. The core units are the "trigger" and the "panel". When a trigger is activated the associated panel should activate or deactivate.

#### Table of Contents
1. [Setup](#setup)
2. [Javascript Options](#javascript-options)
3. [Style Options](#style-options)
4. [Design Notes](#design-notes)
5. [Usage](#usage)

## Setup

### Basic Default Tabcordion HTML

The main points to take notice of for a tabcordion are:

* `data-tabcordion-item` - it holds the trigger when in "tabs" form. In "accordion" form it holds the trigger **and** the panel. This is so the accessibility requirements can be met for each component type.
* `data-tabcordion-trigger` - the element used to activate and deactivate (accordion only) panels.
* `data-tabcordion-panel-holder` - container used to "hold panels" when in "tabs" form. Panels are removed from this container and inserted into their corresponding `data-tabcordion-item` containers when in "accordion" form.
* `data-tabcordion-panel` - container for content which is activated/deactivated.

```html
<div class="basic-tabcordion" data-basic-tabcordion>
  <a aria-controls="first-basic-panel" aria-expanded="true" aria-selected="true" class="basic-tabcordion-trigger active-item" data-tabcordion-trigger="first-basic-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" href="#" id="first-panel-label" role="tab">First Link</a>
  <a aria-controls="second-basic-panel" aria-expanded="false" aria-selected="false" class="basic-tabcordion-trigger" data-tabcordion-trigger="second-basic-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" href="#" id="second-panel-label" role="tab">Second Link</a>
  <a aria-controls="third-basic-panel" aria-expanded="false" aria-selected="false" class="basic-tabcordion-trigger" data-tabcordion-trigger="third-basic-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" href="#" id="third-panel-label" role="tab">Third Link</a>
  <div class="basic-tabcordion-panels" data-tabcordion-panel-holder>
    <div aria-hidden="false" class="basic-tabcordion-content active-item" data-tabcordion-panel="first-basic-panel" id="first-basic-panel" role="tabpanel"></div>
    <div aria-hidden="true" class="basic-tabcordion-content" data-tabcordion-panel="second-basic-panel" id="second-basic-panel" role="tabpanel"></div>
    <div aria-hidden="true" class="basic-tabcordion-content" data-tabcordion-panel="third-basic-panel" id="third-basic-panel" role="tabpanel"></div>
  </div>
</div>
```

### Horizontal Tabcordion

```html
<div class="basic-tabcordion horizontal" data-basic-tabcordion>
  <!-- Change the "large" columns to suit the design. -->
  <div class="sm-col-12 lg-col-4">
    <a aria-controls="first-horizontal-panel" aria-expanded="true" aria-selected="true" class="basic-tabcordion-trigger active-item" data-tabcordion-trigger="first-horizontal-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" href="#" id="first-horizontal-panel-label" role="tab">First Link</a>
    <a aria-controls="second-horizontal-panel" aria-expanded="false" aria-selected="false" class="basic-tabcordion-trigger" data-tabcordion-trigger="second-horizontal-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" href="#" id="first-horizontal-panel-label" role="tab">Second Link</a>
    <a aria-controls="third-horizontal-panel" aria-expanded="false" aria-selected="false" class="basic-tabcordion-trigger" data-tabcordion-trigger="third-horizontal-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" href="#" id="first-horizontal-panel-label" role="tab">Third Link</a>
  </div>
  <!-- Change the "large" columns to fill the rest of the space. -->
  <div class="basic-tabcordion-panels lg-col-8" data-tabcordion-panel-holder>
    <div aria-hidden="false" class="basic-tabcordion-content active-item" data-tabcordion-panel="first-horizontal-panel" id="first-horizontal-panel" role="tabpanel"> </div>
    <div aria-hidden="true" class="basic-tabcordion-content" data-tabcordion-panel="second-horizontal-panel" id="second-horizontal-panel" role="tabpanel"></div>
    <div aria-hidden="true" class="basic-tabcordion-content" data-tabcordion-panel="third-horizontal-panel" id="third-horizontal-panel" role="tabpanel"></div>
  </div>
</div>
```

### Basic Accordion

```html
<div class="basic-accordion" data-basic-accordion>
  <a href="#" aria-controls="first-basic-panel" aria-expanded="true" aria-selected="true" class="basic-accordion-trigger active-item" data-tabcordion-trigger="first-basic-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" id="first-panel-label" role="tab">First Link</a>
  <div aria-hidden="false" class="basic-accordion-content active-item" data-tabcordion-panel="first-basic-panel" id="first-basic-panel" role="tabpanel"></div>
  <a href="#" aria-controls="second-basic-panel" aria-expanded="false" aria-selected="false" class="basic-accordion-trigger" data-tabcordion-trigger="second-basic-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" id="second-panel-label" role="tab">Second Link</a>
  <div aria-hidden="true" class="basic-accordion-content" data-tabcordion-panel="second-basic-panel" id="second-basic-panel" role="tabpanel"></div>
  <a href="#" aria-controls="third-basic-panel" aria-expanded="false" aria-selected="false" class="basic-accordion-trigger" data-tabcordion-trigger="third-basic-panel" data-track-elem="tab" data-track-name="Panel Track Name" data-track-trigger="switch" id="third-panel-label" role="tab">Third Link</a>
  <div aria-hidden="true" class="basic-accordion-content" data-tabcordion-panel="third-basic-panel" id="third-basic-panel" role="tabpanel"></div>
</div>
```


### Javascript Initialization

Pass in the main accordion or tabs container (most likely `.basic-accordion` or `.basic-tabcordion`). A listener for triggers is delegated from `body` so you can active panels from anywhere on the page. Even from another panel. The only requirement for a trigger is that it has the proper data attribute (`[data-tabcordion-trigger]`) and that the value of it points to the panel (`data-tabcordion-panel`) it should open.

```javascript
/**
	Simplest initialization. Select your tab container and pass
	it in with any options if you have any. Also now the variable "tabcordion"
	stores the instance of the dialog and can run it's methods directly.
**/
const tabcordion = new momappoki.components.Tabcordion($('.basic-tabcordion'), { [your options] });

/**
	To intialize a permanent accordion you must pass `type: 'accordion'`
**/
const accordion = new momappoki.components.Tabcordion($('.basic-accordion'), { type: 'accordion', [your options] });

/**
	Need to save references to tabs for control in your javascript?
	This will give you an object with keys that relate to the container ID's
	and can hide/show them programatically.
**/

const allTheTabs = $('[data-generic-tabs-selector]').toArray().reduce((obj, el) => {
	const $el = $(el);

	obj[$el.attr('id')] = new momappoki.components.Tabcordion($el);

	return obj;
}, {});

/**
	Result:

	allTheTabs = {
		'tabs-1': Tabcordion instance,
		'tabs-2': Tabcordion instance,
		'tabs-3': Tabcordion instance
	}

	Run something.

	allTheTabs['tabs-1'].setActive('some-panel-id');
**/

```

## Javascript Options

##### accordionBP
The breakpoint that tabs would turn into an accordion. If changed the CSS styling the tabs would need to reflect the change. It listens to our media query service and represents a **max** breakpoint. So the default of `'medium'` would turn tabs into an accordion from the medium breakpoint down.

Type: `string`  
Default: `'medium'`

##### maxActive
Sets a limit on the number of active accordion panels. Any accordion panels that are activated over this limit would cause the oldest panel currently activated to close.

Type: `number`  
Default: `1`

##### minActive
Sets a minimum number of accordion panels that need to be active at one time.

Type: `number`  
Default: `0`

##### type
Sets the type of component to initialize. If set to `'tabcordion'` the tab component will function as tabs above the `accordionBP` and as an accordion below. If set to `'accordion'` the component will always function as an accordion.

Type: `string`  
Default: `'tabcordion'`  
Options: `'tabcordion'`, `'accordion'`

##### onActive
Callback function fired when a new panel is activated.

Type: `function`  
Default: `$.noop`  
Arguments: `activeID` (Active panel ID), `this`

##### onInactive
Callback function fired when a panel is deactivated.

Type: `function`  
Default: `$.noop`  
Arguments: `inactiveIDs` (Deactived panel ID or array of IDs), `this`

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
mySavedTabcordion.setActive('whatever-panel');
```

## Javascript Template

Accordions and Tabcordions can be created with javascript using our template. The same data can be used to create either component HTML. After the HTML is appended to the page it will need to be used to initialize the javascript part of the component.

```js
const exampleTabcordionData = {
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
};

/**
	To exclude the Tabcordion/Accordion wrapper element pass "false" (boolean) to the base template.
**/

momappoki.templates.tabcordion.base()
const tabcordionHTML = momappoki.templates.tabcordion.base()(exampleTabcordionData);

// You can also precompile a template and wait to send data through it.
const savedAccordionTemplate = momappoki.templates.accordion.base();

// Now I need the HTML
const accordionHTML = savedAccordionTemplate(exampleTabcordionData);
```

There are several parts of each component that are available as pieces.

```js
momappoki.templates[accordion or tabcordion] = {
	base,
	item,
	panel,
	trigger
};
```

## Style Options
There are a few modifier classes that can be applied to achieve the different global configurations.

* `.gray` - (both) Use this modifer for `light-gray` triggers. Default is `patina-2`.
* `.flat` - (accordion) Use this modifier on accordions to remove the background and borders. This is the standard styling applied to FAQs.
* `.stepped` - (accordion) Used on accordions that are used to step a user through a process. ([Design Doc](http://ux.int.momappoki.com/design/styles/stepped-process/))
	* **Note** - it's recommended that stepped accordions are initialized individually so a reference can be saved and then panels can be programattically activated/deactivated to control the users actions.
* `.horizontal` - (tabs) Used for tabs that are placed in line with the tab panels. **Note** - this does require a slightly modified HTML structure seen [here](#horizontal-tabcordion).
* `.accounts-[account color]` - (tabs) Can be applied to `.basic-tabcordion-trigger` to apply account border colors to tab triggers. ([Design Doc](http://ux.int.momappoki.com/design/styles/tabs/))
	* **Possible classes** - `.accounts-ira`, `.accounts-cds`, `.accounts-savings`, `.accounts-checking`, `.accounts-mortgage`, `.accounts-credit-card`, `.accounts-investments`, `.accounts-auto`, `.accounts-dealer`
	*  **Note** - apply account modifiers to all triggers. You can't mix regular and account triggers because the dimensions are different.


## Design Notes

### Variations

* Standard tabs can be styled in “Light Gray” or “Patina 2”, at the discretion of the designer
* Style will carry across all breakpoints and determine the appearance of accordions on mobile devices
* When deciding which tab style to implement, consideration should be given to achieving a balance of color within a given layout and providing enough affordance on inactive tabs (and corresponding accordion headers at smaller breakpoints)
* Account-color indicator bands are for limited use, and may only be applied to “Light Gray” tabs, and only if indicating content associated with the account types specified in the colors section.

### When To Use This Pattern

Tabs can be used to:

* Organize information with a similar context into a compact space
* Allow users to easily alternate between content panels while remaining on a single page

### Best Practices

* One tab is always pre-selected/active on page load
* Active tabs are highlighted and visually distinct from inactive tabs, creating affordance
* To maintain scanability, labels are succinct and ideally do not wrap or truncate
* The entire tab will act as a target to activate a panel

### Notes

* Active tabs are visually connected to the content panel
* Tabs appear in a single row, preferably in a horizontal layout but may be used vertically if space is constrained or tab order is important
* When used in a vertical layout, tab labels should not exceed content panels in width
* On mobile devices or small breakpoints, tabs appear as an accordion and follow standard accordion rules
* Tab width will vary depending on label length, minimum tab width is 1 column
* Tab panel width and height may vary depending on content length but size should be informed by the 12 column grid
* Text based content follows standard line-length rules and should not exceed 8 columns
