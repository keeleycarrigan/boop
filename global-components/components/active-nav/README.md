momappoki Active Nav
===============

The Active Nav component takes the current scroll position on the page and adds the `active` class to the element with either the `href` or the `data-active-section`.

### Initialization

Active Nav can be auto initialized by adding an attribute in the HTML, or can be called manually in JavaScript. Either way, the *context* will have the `data-active-nav="initialized"` attribute on the context element in the DOM once it has been initialized.

```javascript
momappoki.components.activeNav();

// or

new momappoki.components.activeNav();
```

#### HTML Attribute Initialization

Active Nav is in core.bootstrap and will auto initialize on all elements that have the `data-active-nav` attribute.

```html
<ul data-active-nav>
    <li><a href="#section1">Section 1</a></li>
    <li><a href="#section2">Section 2</a></li>
</ul>
```

### Passing in options
Options can be set by either passing them in on instantiation, or by putting JSON in the markup.

#### JavaScript
The parameter passed can be a jQuery element if that's all that is needed, or an object with the options needed.

```javascript
// only element
momappoki.components.ActiveNav($('#element'));

// object
momappoki.components.ActiveNav({ context: $('#element'), offset: 100 });
```

#### HTML
If no options are passed in, the element with the `data-active-nav` attribute will serve as the *context*. Otherwise options are passed in with the `data-active-nav-options` attribute;

```html
<!-- by itself -->
<div data-active-nav>STICK ME!</div>

<!-- with options -->
<ul data-active-nav data-active-nav-options='{ "offset":"200" }'>
    <li><a href="#section1">Section 1</a></li>
    <li><a href="#section2">Section 2</a></li>
</ul>
```

### List of options

##### context
Default: `null`

The context element that contains the nav pieces you want to be active.

##### activeTitleElement
Default: `$('.section-title')`

The element you want to act as the **title** and will change depending on scroll location.

##### elementString
Default: `a[href*=#]`
Other Options: `[data-active-section]`

The element string to search for inside the context. These elements will be given the `active` class when they are active. The attribute needs to be a hash corresponding with a section id.

```html
<ul data-active-nav>
    <li><a href="#section1">Section 1</a></li>
    <li><a href="#section2">Section 2</a></li>
</ul>
<!-- or -->
<ul data-active-nav>
    <li data-active-section="#section1">Section 1</li>
    <li data-active-section="#section2">Section 2</li>
</ul>

<!-- then.... -->

<section id="section1"></section>
<section id="section2"></section>
```

##### offset
Default: `60`

The offset for ALL sections. Can be overridden on a section by section basis in the HTML.

### Other options...

##### data-active-offset

Add a `data-active-offset` to the **section** to which you are scrolling to have a different offset for one particular section on a page. Can be a negative number. The more positive the number, the sooner it will be active *before* the window scrolls to the section

ex: `data-active-offset="50"`

### Events

##### $('body') events:
`momappoki.activeNav.activeSection` 

This event passes the active hash so you can listen for the active hash changes.

```javascript
$('body').on('momappoki.activeNav.activeSection', function(evt, hash) {
    // evt is the jQuery event on the body
    // hash will be the new active hash
});
```
