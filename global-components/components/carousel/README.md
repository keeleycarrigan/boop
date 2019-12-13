Carousel
=======
The momappoki Storefront Carousel is a responsive mixed media variable item width carousel. 


#### Requirements
**Lodash.js** for templating and object traversal  
**Hammer.js** for Touch Events

# Initialization
## Required Markup Structure
The markup below is the simplest markup structure to set up a carousel.

**NOTE** All `tabindex` and `aria-*` and `data-*` attrobutes in below markup are required. It is recommended to copy and paste below markup to begin carousel implementation.The data-track-region attribute should descriptive and unique, this allows dtm to distinguish multiple carousels when there is more than on on a page.

```html
<!--Carousel-->
<div data-carousel class="basic-carousel" tabindex="0" aria-label="Features Gallery" data-track-region="features-carousel">
  <div class="basic-carousel-content">
    <button type="button" class="basic-carousel-nav-arrow hide-md-down" data-carousel-nav="prev" aria-label="Previous View">
      <i class="momacon-glyph-chevron-left large" aria-hidden="true"></i>
    </button>
    <div class="basic-carousel-viewport" tabindex="0" data-carousel-viewport>
      <div class="basic-carousel-stage" data-carousel-stage>
        <div class="basic-carousel-panel" data-carousel-item data-carousel-panel-sizes='{ "small": "full" }'>
          {{CONTENT GOES HERE}}
        </div>
      </div>
    </div>
    <button type="button" class="basic-carousel-nav-arrow hide-md-down" data-carousel-nav="next" aria-label="Next View">
      <i class="momacon-glyph-chevron-right large" aria-hidden="true"></i>
    </button>
  </div>
  <div class="basic-carousel-nav-panel">
    <button type="button" class="basic-carousel-nav-arrow hide-lg-up" data-carousel-nav="prev" aria-label="Previous View">
      <i class="momacon-glyph-chevron-left large" aria-hidden="true"></i>
    </button>
    <div data-carousel-nav-item-wrapper class="basic-carousel-nav-item-wrapper">
      <nav data-carousel-nav-items class="basic-carousel-nav-items">
      </nav>
    </div>
    <button type="button" class="basic-carousel-nav-arrow hide-lg-up" data-carousel-nav="next" aria-label="Next View">
      <i class="momacon-glyph-chevron-right large" aria-hidden="true"></i>
    </button>
  </div>
</div>
```
### Carousel Item
The carousel item is denoted above by the `div` with `[data-carousel-item]` attribute. Each requires the class and data attributes above. The `[data-carousel-panel-sizes]` attribnute will be discussed below in the options section. 
The carousel itself has no opinion about the content within an individual item. Use normal row/column layout and other utility classes to control the items presentation.

## Class/Object Initialization
This is the default initialization.
```js
var carousel = new momappoki.components.Carousel($('.basic-carousel'));
```
Alternatively, options may be passed to the constructor.
```js
var carousel = new momappoki.components.Carousel($('.basic-carousel'), {
  defaultPanelSizes: {
    small: 'full'
  },
  defaultItem: 0,
  itemAriaLabelPrefix: 'Feature',
  onInit: $.noop
});
```
Options may also be passed in the markup, on the main container `div[data-carousel]`, via `data-carousel-opts`

# Options

Default options for every carousel.

```js	
const DEFAULTS = {
  defaultPanelSizes: {
    small: 'full'
  },handleNavClick
  defaultItem: 0,
  itemAriaLabelPrefix: 'Feature',
  onInit: $.noop
};
```


## onInit
**Type**: `function`  
**Default**: `$.noop`

Callback function that if provided will called once, after carousel has been initialized.

## itemAriaLabelPrefix
**Type**: `string`  
**Default**: `Feature`

This is the prefix that will be added to each item in the carousel. The aria label will be this value plus the array index of the item + 1.


## defaultItem
**Type**: `number`  
**Default**: `0`

This indicates which item should be visible by default. The value is the array index (0 based) of the item.

## defaultPanelSizes
**Type**: `object`  
**Default**: `{small: 'full'}`

These are the default panel sizes for the carousel. The default value will create full width slides for all breakpoints, if no sizes are passed on individual items.
**NOTE** This should not be relied on to controll item widths. Item widths should be passed on each item. This is simply a fail safe.

# Carousel Item Panel Sizes
This attribute on a carousel item is the driver for responsive sizing and multiple size viewports, thus it warrants some detailed discussion.

These are the available breakpoints and corresponding width values:
```js
  const BP_ORDER = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
  const WIDTHS = {
    full: '100%',
    half: '50%',
    third: '33.3333%',
    quarter: '25%'
  };
```

Each carousel item should include this attribute `data-carousel-panel-sizes`. The value of this should be a JSON object of the form:
```js
data-carousel-panel-sizes='{ "small": "full" }'
```

This allows each item to specify specific widths for itself per breakpoint.
```js
{
  "small": "full",
  "medium": "half",
  "large": "third",
  "xlarge": "quarter",
  "xxlarge": "full"
}
```
If a breakpoint is not provided then the previous breakpoints value will be used. For example, if the medium breakpoint was omitted in the object above, then on small AND medium sized screens the item would be full width.
**NOTE** Small and large should be the most common breakpoints as we treat tablet(medium) much the same as phones. 

# Methods

## goToSlide
Handles setting nav button active class and animating stage.

Shows specified slide. The only param required below is the number of hte slide to show. This is a 1-based value. if the second parameter is passed as true, the viewport will receive focus.

param {Number} slideToShow The slide key to find and show.

param {Boolean} [focus=false] Should focus on viewport be triggered.

param {Boolean} [track=true] Should fire tracking event for DTM.

param {jQuery Collection} [$navPanel=this.$navPanel]

param {Collection} [slides=this.slides]

param {jQuery Object} [$viewport=this.$viewport]

## jumpToSlide
Jumps to a specific slide. Event handler for Nav buttons below carousel. Should not be used programmatically.

## prevSlide
Goes to previous slide from current slide.

## nextSlide
Goes to next slide from current slide.

## handleNavClick
Event handler for Nav arrows on either side of carousel and for swiping left/right on touch devices. Should not be used programmatically.

## updateStage
Updates carousel items, widths, and slide pagination.

## updateOptions
Updates Carousel base options. Does not refresh Carousel.

@param {Object} [newOptions={}]

@returns The current Carousel instance

## updateItemOrder
This method is for reordering items, primarily through Adobe Target, but can be used outside of this context.

updateStage MUST be called after all reordering calls are performed.

@param {Number} oldIndex 0-based index of item to move.

@param {Number} newIndex 0-based index of where to place item.

## addCarouselItem
This method is for inserting a new item into the carousel, primarily through Adobe Target, but can be used outside of this context.

@param {Object} { sizes, content, index } Sizes are breakpoints sizes. Content is the html or other content that will inserted into the item. Index is the 0-based position to insert at. If index is not provided, then item will be added to end.

@returns The current Carousel instance

## removeCarouselItem
This method is for removing items, primarily through Adobe Target, but can be used outside of this context.

@param {String} itemIndex The 0-based index of item to remove;

@returns The current Carousel instance
