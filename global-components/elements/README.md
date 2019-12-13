# Elements

Elements are kind of like components, but much simpler and usually don't have javascript that creates specific interactivity alongside.


## Links

There are a couple different types of links where the use depends on the link's context or container background color. Visuals can be seen [here](http://ux.int.momappoki.com/design/elements-index/typography/) near the top of the page.

* Normal link - `<a href="#"></a>`
* Link in the middle of text - `<a href="#" class="link-inline"></a>`
* White link on a dark background - `<a href="#" class="link-white"></a>`
* Accessible blue link on dark background - `<a href="#" class="link-dark-bg"></a>`

## Lists

List visuals can be seen near the bottom of [this page](http://ux.int.momappoki.com/design/elements-index/typography/). A normal `ul` with no class applied has no styling.

* Default list with no bullets with default list element spacing. - `<ul class="list-default"></ul>`
* Bulleted list. - `<ul class="list-bulleted"></ul>`
* Ordered list. - `<ul class="list-ordered"></ul>`
* Nested list. Should be nested inside a parent list's `li`. - `<ul class="list-nested"></ul>`
* Horizontal list. No bullets or separators. - `<ul class="list-horizontal"></ul>`
* Horizontal list with separators in between items. - `<ul class="list-horizontal separated"></ul>`

## Villain
The `.villain` is a basic container for full width "hero" designs. A background image is meant to be applied directly to the `.villain` container and the content inside should be positioned using the grid. By default the background image is removed on medium and lower breakpoints. To remove the background image large down add `.lg-no-bg`.

## Buttons

The standard button element class is `.momappoki-btn`. It can be used on multiple interactable elements such as `button`, `a`, and `input[type="submit"]`.

##### Secondary

Modifier Class: `.secondary`  
Variant Modifer Classes: `.disabled`

##### Outlined

Modifier Class: `.outline`  
Variant Modifer Classes: `.white`, `.disabled`

##### Destructive

Modifier Class: `.destructive`  
Variant Modifer Classes: `.disabled`

##### Breakpoint Specific Tertiary Link

This modifier will turn a make a button look like a normal link at the breakpoint specified. Used a lot for "cancel" buttons in modals.

Modifier Class: `.txt-btn-[breakpoint]`  
Variant Modifer Classes: `.disabled`

##### Breakpoint Specific Expanded Width

This modifier will make a button expand to fill it's container at the breakpoint specified. This is mainly done for "mobile" breakpoints so the breakpoint utilities are limited.

Modifier Classes: `.expand-sm`, `.expand-sm-only`, `.expand-md`, `.expand-md-down`, `.expand-lg`, `.expand-lg-down`

##### Button Group

`.momappoki-btn-group` is a container that should be used when multiple buttons or tertiary links are used in a row. The elements inside should be spaced horizontally using the `margin` spacing utilities.

## Action Buttons

Action Buttons are interactable elements that incorporate a specific icon, or glyph as they are considered here. These glyphs are in the Allycon font, but are not meant to be used outside the context of these elements as they are sized and positioned in relation to the text that accompanies them. The accompanying text is also styled in a specific way that follows how [design](http://ux.int.momappoki.com/design/elements-index/glyphs/) has decided they should be used. The main element used can be a `button` or `a`.

### Navigate
These are mainly "Learn More" type links that end with a dougle chevron. These probably shouldn't be bold because only links in the middle of content should be bold, but `.link-inline` can and should be used to accomplish this.

```html
<a href="#" class="action-btn-navigate">Learn more <i class="momacon-glyph-double-chevron" aria-hidden="true"></i></a>
```

**Note:** The following Action Buttons could possibly used in the context of components that use javascript for interaction or toggling state. There could also be extra attributes necessary depending on the component or use.

### Add

The glyph in this element should be on the left side of the text.

```html
<button class="action-btn-add"><i class="momacon-glyph-plus" aria-hidden="true"></i> Add</button>
```

### Sorting

Depending on the glyph used these would be used for ascending/descending sorting. They are white by default but have a `.dark` modifier.

```html
<a href="#" class="action-btn-sort">Ascending <i class="momacon-glyph-caret-up" aria-hidden="true"></i></a>

<a href="#" class="action-btn-sort">Descending <i class="momacon-glyph-caret-down" aria-hidden="true"></i></a>
```

### Expand Menu

```html
<button class="action-btn-expand">Expand <i class="momacon-glyph-chevron-down" aria-hidden="true"></i></button>
```
