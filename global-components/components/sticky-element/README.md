momappoki Sticky Element
=====================

The Sticky Element is used to stick any element to the top or the bottom of the page when scrolled off the top or bottom of the screen. Once initialized, the element will stick to either the top or the bottom once scrolled passed the section. If top, scrolling down passed the section will stick it to the top. If on bottom, the section will stick until the window is scrolled passed where it would normally stay. 

### Initialization

Sticky Element can be auto initialized by adding an attribute in the HTML, or can be called manually in JavaScript. Either way, the element will have the `data-sticky-element="initialized"` attribute on the element in the DOM once it has been initialized.

#### JavaScript Initialization

```javascript
momappoki.components.StickyElement();

// or

new momappoki.components.StickyElement();
```

#### HTML Attribute Initialization

Sticky Element is in core.bootstrap and will auto initialize on all elements that have the `data-sticky-element` attribute.

```html
<div data-sticky-element>STICK ME!</div>
```

### Passing in options
Options can be set by either passing them in on instantiation, or by putting JSON in the markup.

#### JavaScript
The parameter passed can be a jQuery element if that's all that is needed, or an object with the options needed.
```javascript
// only element
momappoki.components.StickyElement($('#element'));

// object
momappoki.components.StickyElement({ element: $('#element'), position: 'bottom' });
```

#### HTML
If no options are passed in, the element with the `data-sticky-element` attribute will serve as the *element* to stick. Otherwise options are passed in with the `data-sticky-element-options` attribute;

```html
<!-- by itself -->
<div data-sticky-element>STICK ME!</div>

<!-- with options -->
<div data-sticky-element data-sticky-element-options='{ "position":"bottom" }'>STICK ME!</div>

```

### List of options

##### element
Default: `null`

The element to stick.

##### offsets
Default: `[ [0, null] ]`

This is an array of offsets. 
For example:
```javascript
[ [screen size, offset], [screensize, offset] ]
```

If null is the offset, the offset will be figured out automatically based on other sticky elements that will stick before it

##### elementOffsets
Default: `{}`

Use this to stick multiple items with the same classname
For example:
```javascript
momappoki.components.stickyComponent({
  element: $('.sticky-nav'),
  elementOffsets: {
    'jump-nav': [ [0, 0], [768, 41], [1000, 60] ],
    'info-bar': [ [0, 0], [768, 5] ]
  }
});
```

##### usePlaceholder
Default: `true`

The placeholder is put into the position of the stuck element upon the element sticking to keep the page from jumping because an element was taken out of the flow.

##### position
Default: `top`
Other possible: `bottom`

Whether to stick the element to the top or the bottom of the window.

### Events

##### $('body') events:
`momappoki.sticky.add` 

This is triggered every time a new sticky element component is initialized.

##### element events
*element is from options passed in or the element the data-sticky-element attribute is attached*

`momappoki.sticky.change`
This event passes true or false. True if the element stuck, false if the element unstuck.

```javascript
element.on('momappoki.activeNav.activeSection', function(evt, isStuck) {
    // evt is the jQuery event on the body
    // isStuck is whether the element stuck or unstuck
});
```
