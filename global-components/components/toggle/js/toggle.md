# momappoki Toggle



### Description

The toggle component is designed to handle a wide variety of use cases; in general, it is useful when an interaction with one element on a page is meant to trigger a state change in another element.

## Setup

There are two main elements in setting up a toggle. A **trigger** and a **target**. The **target** is the element that is initialized as it can have many **triggers** associated with it.

This **trigger** describes the element the user interacts with. It acts like a lightswitch, triggering state change in the target element.

There are three types of triggers:

- **hover triggers**: trigger change in the target when hovered over. Identified by the `data-hover-toggle-trigger="[mytoggleid]"` attribute.
- **scroll triggers**: trigger change in the target when the trigger is scrolled into view. Identified by the `data-scroll-toggle-trigger="[mytoggleid]"` attribute.
- **click triggers**: trigger change in the target when clicked on. Identified by the `data-click-toggle-trigger="[mytoggleid]"` attribute.

This **target** describes the element that is being affected by the user's interaction with the trigger. Identified by the `data-toggle-id="[mytoggleid]"` attribute.


### Initialization

This component is initialized by passing in a target element. An optional options object can also be passed in. Triggers don't need to be initialized. All you need to do to apply a trigger is set the desired trigger action data attribute to the `data-toggle-id` of its target. This way, a Toggle target could have triggers that trigger the toggle for different types of actions at the same time.

```javascript
const mytoggle = new momappoki.utilities.toggle($('#box-to-be-toggled'), options);
```



## Options
An optional options object can be passed into the validator constructor. This object can contain custom error messages and validation methods.
Example:

```javascript
const options = {
    animate: true,
    animation: myCustomAnimation()
  };
```

#### Passing options in through the HTML
The toggle will find and use the `toggle-opts` attribute on the toggle element. The `toggle-opts` attribute must equal valid JSON. 

An example:
  
```html
<div data-toggle-id="some-id" data-toggle-opts='{ "animationDuration": "500", "animate": "true" }'></div>
```
  
##### animate
Choose if transition will be animated. If this is set, by default the container will perform a jQuery `slideToggle`.

Type: `boolean`  
Default:  `false`

##### animation
The type of animation that will occur on toggle. To customize, pass a function that accepts the jQuery wrapped version of the target element and animates it.

Type: `function`  
Default:  `$el => $el.slideToggle()`

##### animationDuration
The length of the animation that will occur on toggle.

Type: `int` - milliseconds  
Default:  `400`

##### canCloseAll
Boolean that determines if all targets with the same groupID can be closed/toggled off at the same time. Only applies if a target is part of a toggle group.

Type: `boolean`  
Default:  `false`

##### dismissable
Lets an element be toggled off by clicking outside of the main container or pressing escape *(For example, a dropdown menu.)*

Type: `boolean`  
Default:  `false`

##### groupID
A unique ID for multiple target elements to be controlled in a group *(For example, a tab-like interaction.)*.

Type: `string`  
Default:  `null`

##### inactiveClass
Class that is applied when the target is inactive.

Type: `string`  
Default:  `inactive`

##### spotlight
Will apply the `inactiveClass` to all "inactive" targets in a toggle group when one target is activated. *(For example, when you hover over one item in a group and all others' opacity is reduced.)*

Type: `boolean`  
Default:  `false`

##### targetToggleAttrs
An array containing objects that describe attributes to be applied to the target on active and inactive. The object should have three keys: 

- **name** - the attribute that should be applied.
- **active** - the value of the attribute when the trigger is in active state.
- **inactive** - the value of the attribute when the trigger is in an inactive state.

Example:

```js
[
	{
		name: 'aria-hidden',
		active: false,
		inactive: true
	}
]
```

Type: `array`  
Default:  `[]`

##### targetToggleClass
The class applied to the target when the toggle state is applied.

Type: `string`  
Default:  `active`

##### targetRemoveClass
Option to remove, rather than apply the `targetToggleClass`. *(For example, if a target was hidden by default with the `.off` class and the toggle should remove `.off`.)*

Type: `boolean`  
Default:  `false`

##### triggerToggleAttrs
An array containing objects that describe attributes to be applied to the trigger on active and inactive. The object should have three keys: 

- **name** - the attribute that should be applied.
- **active** - the value of the attribute when the trigger is in active state.
- **inactive** - the value of the attribute when the trigger is in an inactive state.

Example:

```js
[
	{
		name: 'aria-expanded',
		active: true,
		inactive: false
	}
]
```

Type: `array`  
Default:  `[]`

##### triggerToggleClass
The class applied to the trigger when the toggle state is applied.

Type: `string`  
Default:  `active`

##### triggerRemoveClass
Option to remove, rather than apply the `triggerToggleClass`. *(For example, if a trigger had an `.inactive` class by default and you wanted to remove it when it's target was active.)*

Type: `boolean`  
Default:  `false`

##### targetScrollToggle
Boolean that adds the target to an event loop that checks to see if any of its triggers have been scrolled to or past. *(For example, if a CTA is scrolled past the viewport and it's desired that a new CTA still in the viewport is shown.)*

Type: `boolean`  
Default:  `false`


##### thereCanOnlyBeOne
Boolean that determines if only one target of multiple with the same groupID can be opened/toggled on at the same time. Could be used with a group of dropdowns or to recreate tab-like functionality.

Type: `boolean`  
Default:  `true`

##### onInit
Function to be triggered on the initialization of the toggle.

Type: `function`  
Default:  `$.noop`

##### onActive
Function to be triggered when the toggle state is applied.

Type: `function`  
Default:  `$.noop`

##### onInactive
Function to be triggered when the toggle state is unapplied.

Type: `function`  
Default:  `$.noop`

##### onToggle
Function to be triggered when the toggle state is switched on or off.

Type: `function`  
Default:  `$.noop`

##### onKeydown
Function that will be triggered when a user hits space or enter with focus on the trigger element.

Type: `function`  
Default:  `$.noop`


## Methods

##### toggle

The only public method. It toggles the target, passing in the chosen trigger as an argument. All arguments are optional.

Arguments: $trigger: `jQuery Object`, active: `boolean`, inactive: `boolean`  
Returns: `boolean`


### Sample HTML:

```html
<button aria-expanded="false" class="action-btn-expand" data-click-toggle-trigger="myToggle"><span>Toggle Me</span><i class="momacon-glyph-chevron-down"></i></button>

<div id="myToggle" style="display:none" data-toggle-id="myToggle" toggle-opts='{ "animate": "true", "triggerToggleAttrs": [{ "name: "aria-expanded", "active": "true", "inactive": false" }] }'>
</div>
```
