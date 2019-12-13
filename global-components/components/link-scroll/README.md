momappoki Link Scroll
================

The Link Scroll component takes a clicked link and scrolls to a specific section on the page. The clicked element must be a link with an `href`. Link Scroll can be initialized either manually in JavaScript or by adding the `data-link-scroll` attribute to the context (container of the link(s)) you want. Once initialized, it will listen to the *delegate (what's being clicked)* inside of the *context (the container)*. Once the delegate is clicked, it takes the href from the delegate and scrolls to the section with the same id from the href.

`href="#section"` will scroll to `<section id="section"></section>`.

Example
```html
<ul class="link-scroll-container">
  <li><a data-scroll-to href="#Section1">Section 1</a></li>
  <li><a data-scroll-to href="#Section2">Section 2</a></li>
  <li><a data-scroll-to href="#Section3">Section 3</a></li>
</ul>

<section id="Section1"></section>
<section id="Section2"></section>
<section id="Section3"></section>
```

### Focus Considerations

To ensure focus moves off of the navigation and to the header ensure the header has a `tabindex` of -1 and the `data-scroll-focus` attribute. Both are required for the focus to actually move out of the nav bar.

Example

```html
<section id="section1">
  <h2 tabindex="-1" data-scroll-focus>Features</h2>
</section>
```

### Initialization
Once initialized by either auto initialization, or JavaScript initialization, the context element will contain `data-link-scroll="initialized"`. If this does not appear on the context element, it has not yet been initialized or there is an issue.

#### JavaScript Initialization

```javascript
momappoki.components.linkScroll($('.link-scroll-container')); // context element passed in for above example

// or

new momappoki.components.linkScroll($('.link-scroll-container')); // context element passed in for above example
```

#### HTML Attribute Initialization

Link Scroll is in core.bootstrap and will auto initialize on elements if you so desire. This is done by adding `data-link-scroll` to the context (the container that has the link(s) inside) element.

Example:
```html
<ul data-link-scroll>
  <li><a data-scroll-to href="#Section1">Section 1</a></li>
  <li><a data-scroll-to href="#Section2">Section 2</a></li>
  <li><a data-scroll-to href="#Section3">Section 3</a></li>
</ul>
```

### Options
These options can be set by either passing them in on instantiation, or by putting JSON in the markup.

##### context

Default: `$('body')`

The context is the parent element of the links you want to listen to.

##### duration

Default: `400`

The duration of the scroll animation.

##### setupContextListener

Default: `true`

Set this to false if you **only** want to use the link scroll manually for some reason. Once instantiated, you can always call it manually if you would like.

For example:
```javascript
momappoki.components.linkScroll({ context: $('#id'), setupContextListener: false });

$('#id').trigger('momappoki.linkScroll.scrollTo', '#Section');
```

##### offset

Default: `30`

This is the amount the scroll will stop **before** it reaches a section.

##### delegate

Default `[data-scroll-to]`

The delegate inside the context to listen for click events

### Other options...

##### data-scroll-offset

Add a `data-scroll-offset` to the **section** you are scrolling to to have a different offset for one particular section on a page. Can be a negative number. The more positive the number, the sooner the scroll will stop *before* the section.

ex: `data-scroll-offset="50"`

##### data-link-scroll-options

All the options can be put into the html context that you choose. In this example, we will change the delegate so we don't need to have the `data-scroll-to` on each delegated element.

```html
<ul data-link-scroll data-link-scroll-options="{ 'duration': '1000', 'offset': '50', 'delegate': 'a[href]' }">
  <li><a href="#Section1">Section 1</a></li>
  <li><a href="#Section2">Section 2</a></li>
  <li><a href="#Section3">Section 3</a></li>
</ul>
```

### Events

#### Call scroll manually
Once initialized, you can call scroll manually:
```javascript
context.trigger('momappoki.linkScroll.scrollTo', '#SectionID');
```

###### $('body') events:
`momappoki.linkScroll.scrollStart`
`momappoki.linkScroll.scrollComplete`
