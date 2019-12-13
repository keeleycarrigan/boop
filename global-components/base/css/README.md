# Base Utility Classes

These styles represent the basic building blocks of page design. They should be used in combination with our components to accomplish all page layout and functionality. Very little custom CSS should be needed to create a new page and any deviations from what these tools offer should be brought back to design and considered before moving forward.

- [Borders](#borders-file)  <sub><sup>[file][border file]</sup></sub>
- [Colors](#colors-file)  <sub><sup>[file][color file]</sup></sub>
- [Display](#display-file)  <sub><sup>[file][display file]</sup></sub>
- [Grid](#grid-file)  <sub><sup>[file][grid file]</sup></sub>
- [Spacing](#spacing-file)  <sub><sup>[file][spacing file]</sup></sub>
- [Text Align](#alignment-file)  <sub><sup>[file][align file]</sup></sub>
- [Text Size](#sizing-file)  <sub><sup>[file][size file]</sup></sub>

[//]: # (Yes, I added a super text tag inside a sub-text tag. It all renders out fine )

| Breakpoint |  Code  |
|   :----:   | :----: |
|   Small    |   sm   |
|   Medium   |   md   |
|   Large    |   lg   |
|   X-Large  |   xl   |

## Borders <sub><sup>[file][border file]</sup></sub>

### Structure

The border classes we currently have work to define `1px` and `2px`, `solid` borders for specific edges from the given breakpoint up. The construction is:  `.border-[edge][width]-[breakpoint]`. It's best to apply these classes starting in the small range then only adding new ones when the spacing needs to be changed.

Where `.border-l1-md` would give a border-left that is `1px solid` for the **medium** breakpoint and up, but `.border-l0-xl` turns off that border at the extra-large breakpoint using `1` for **on** and `0` for **off**.
### Example
**Note:** Border classes support _sm_, _md_, _lg_, and _xl_ breakpoints

```html
<!--
	This div would have a top border on small, then only a bottom border on medium
	through large, and then no border at all on x-large.
-->

<div class="border-t1-sm border-t0-md border-b1-md border-b0-xl"></div>
```

## Colors <sub><sup>[file][color file]</sup></sub>

Our color classes are based off of the current color map as defined by the momappoki design standard. We should be using only the colors in the list `$ux-colors` in the colors [partial file][color-link]. Usage of specific color variables is **sometimes** better for usage with sass functions. _ex. darken()_ Confirming with a senior/lead will reduce headaches when it is time for PR review.

We have classes for text, background, and border for all colors in the `$ux-colors` list, including account and accessible colors. Our sass builds per color, taking a `$name` and it's matching `$color`, and simply fills in the correct places for the three properties. For our _accounts_ and _accessible_ colors we do specify which version of the color we want with a simple modifier before the LoB name.

```css
// General colors
  .txt-white {
    color: #FFFFFF;
  }

  .bg-slate-3 {
    background-color: #959595;
  }

  .border-black {
    border-color: #000000;
  }

// Account and Accessible colors
  .txt-account-checking {
    color: #03A9F4;
  }

  .bg-accessible-mortgage {
    background-color: #5A822B;
  }

  .border-account-credit-card {
    border-color: #FFC107;
  }

```
[Color Reference List][color-link]

### UX Colors
  - ![#650360](https://placehold.it/15/650360/000000?text=+) `plum: #650360`
  - ![#008486](https://placehold.it/15/008486/000000?text=+) `toaster: #008486`
  - ![#E7F6FD](https://placehold.it/15/E7F6FD/000000?text=+) `patina-1: #E7F6FD`
  - ![#D7E4EB](https://placehold.it/15/D7E4EB/000000?text=+) `patina-2: #D7E4EB`
  - ![#C0D0D8](https://placehold.it/15/C0D0D8/000000?text=+) `patina-3: #C0D0D8`
  - ![#8BD3F5](https://placehold.it/15/8BD3F5/000000?text=+) `sky-1: #8BD3F5`
  - ![#3798C7](https://placehold.it/15/3798C7/000000?text=+) `sky-2: #3798C7`
  - ![#006899](https://placehold.it/15/006899/000000?text=+) `sky-3: #006899`
  - ![#E8D4A3](https://placehold.it/15/E8D4A3/000000?text=+) `sand: #E8D4A3`
  - ![#FFFFE7](https://placehold.it/15/FFFFE7/000000?text=+) `field-focus: #FFFFE7`
  - ![#FFFFFF](https://placehold.it/15/FFFFFF/000000?text=+) `white: #FFFFFF`
  - ![#F8F8F8](https://placehold.it/15/F8F8F8/000000?text=+) `light-gray: #F8F8F8`
  - ![#F2F2F2](https://placehold.it/15/F2F2F2/000000?text=+) `page-gray: #F2F2F2`
  - ![#E5E5E5](https://placehold.it/15/E5E5E5/000000?text=+) `slate-1: #E5E5E5`
  - ![#DDDDDD](https://placehold.it/15/DDDDDD/000000?text=+) `slate-2: #DDDDDD`
  - ![#959595](https://placehold.it/15/959595/000000?text=+) `slate-3: #959595`
  - ![#666666](https://placehold.it/15/666666/000000?text=+) `slate-4: #666666`
  - ![#2A2A2A](https://placehold.it/15/2A2A2A/000000?text=+) `slate-5: #2A2A2A`
  - ![#000000](https://placehold.it/15/000000/000000?text=+) `black: #000000`
  - ![#0B8100](https://placehold.it/15/0B8100/000000?text=+) `success: #0B8100`
  - ![#D42825](https://placehold.it/15/D42825/000000?text=+) `error: #D42825`

  **accounts-**
  - ![#FF5722](https://placehold.it/15/FF5722/000000?text=+) `ira: #FF5722`
  - ![#9C27B0](https://placehold.it/15/9C27B0/000000?text=+) `cds: #9C27B0`
  - ![#3F51B5](https://placehold.it/15/3F51B5/000000?text=+) `savings: #3F51B5`
  - ![#03A9F4](https://placehold.it/15/03A9F4/000000?text=+) `checking: #03A9F4`
  - ![#8BC34A](https://placehold.it/15/8BC34A/000000?text=+) `mortgage: #8BC34A`
  - ![#FFC107](https://placehold.it/15/FFC107/000000?text=+) `credit-card: #FFC107`
  - ![#009688](https://placehold.it/15/009688/000000?text=+) `investments: #009688`
  - ![#5E7B87](https://placehold.it/15/5E7B87/000000?text=+) `auto: #5E7B87`
  - ![#424E61](https://placehold.it/15/424E61/000000?text=+) `dealer: #424E61`

  **accessible-**
  - ![#FF5722](https://placehold.it/15/FF5722/000000?text=+) `ira: #FF5722`
  - ![#9C27B0](https://placehold.it/15/9C27B0/000000?text=+) `cds: #9C27B0`
  - ![#3F51B5](https://placehold.it/15/3F51B5/000000?text=+) `savings: #3F51B5`
  - ![#027DB6](https://placehold.it/15/027DB6/000000?text=+) `checking: #027DB6`
  - ![#5A822B](https://placehold.it/15/5A822B/000000?text=+) `mortgage: #5A822B`
  - ![#FFC107](https://placehold.it/15/FFC107/000000?text=+) `credit-card: #FFC107`
  - ![#008577](https://placehold.it/15/008577/000000?text=+) `investments: #008577`
  - ![#5E7B87](https://placehold.it/15/5E7B87/000000?text=+) `auto: #5E7B87`

[color-link]: utilities/_colors.scss

## Display <sub><sup>[file][display file]</sup></sub>

This file allows us to easily toggle the visibility of an element from javascript, and gives us a class that will hide content from sighted users while leaving it accessible for screen readers. This works by shrinking the element to a 1px square with a -1px margin to not impact other spacing, and then clipping the content to a 0px square and hiding the now overflowing content.
#### [Classes][display file]
- `.on`
- `.on-inline`
- `.off`
- `.visuallyhidden` - used for accessibility

## Grid <sub><sup>[file][grid file]</sup></sub>

The grid classes are how we should all be handling page structure and give a large amount of control over how our pages flow.

### Grid Container Classes
The main grid containers are `.row` and `.flex-row`. These give a max width to our content as well as allow grid columns to be nested. The main difference between the two should be obvious. If you need flexbox alignment for your columns use `.flex-row`, otherwise just use `.row`.

#### Grid Container Modifiers
There are container utility classes that can be used to affect the row content.

|  Modifiers |  Effect  |
|    :---:   |   :---  |
| `.collapse` | Removes the gutter padding from the row's direct child columns. |
| `.no-wrap` | Used on `.flex-row` to force it's children to wrap if they need to |
| `.flex-content-container-[row\|column]` | Mostly used for nested column rows to make sure child columns can be aligned to the full parent container's size. |
|   .[flex-property]-[value]-[breakpoint]   | Used to align a row's columns. See the table below. Breakpoint naming follows the visibility class convention (ex. `-md` = only, `-md-up` = min, `-md-down` = max) |

##### Flex Properties
|         property / values      | center | start | end | between | stretch | around | base |
|------------------------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **align-items**                  | &#10004;      | &#10004;     | &#10004;   |         | &#10004;       |        | &#10004;    |
| **justify**                      | &#10004;      | &#10004;     | &#10004;   | &#10004;       |         | &#10004;      |      |
| **align-content**                | &#10004;      | &#10004;     | &#10004;   | &#10004;       | &#10004;       | &#10004;      |      |
| **align-self** (only on columns) | &#10004;      | &#10004;     | &#10004;   |         | &#10004;       |        | &#10004;    |
[<sub>Flex Reference MDN</sub>]( https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

### Column Layout Classes
Layout widths should be produced by using the grid column classes following the structure `.[breakpoint]-col-[#]`. The columns range from **1-12** and can be nested. Nested columns have to be contained within a new row. If the container is a `.flex-row` you have the option to use `.[breakpoint]-flex-col` to achieve certain layouts. This is just a container with no inherent width that follows the normal flex child rules. It can be mixed with column based siblings as well.

```html
<!-- Example of nested columns. -->

<div class="row">
  <div class="sm-col-12 lg-col-6">
    <div class="row">
      <div class="sm-col-12 lg-col-3"></div>
      <div class="sm-col-12 lg-col-3"></div>
      <div class="sm-col-12 lg-col-3"></div>
    </div>
  </div>
</div>
```

#### Column Positioning
There are also modifier column classes to position the column horizontally, as in the info-bar with breadcrumbs on the left and page info on the right. They are structured with an additional modifier `.[breakpoint]-[modifier]-col-[#]` and should be applied in addition to the previous `-col` classes to maintain correct content width.

|  Modifiers |  Effect  |
|    :---:   |   :---:  |
|   offset   | Adds the `[#]` of columns specified in margin to the left of the column container. |
|    push    | Moves just the selected content the `[#]` of columns **right**, can overlap following content.
|    pull    | Moves just the selected content the `[#]` of columns **left**, can overlap following content.
|   center   | Center the content in the row, `[#]` defines the width of the content |

#### Content Manipulation
Each breakpoint has:

- Display utilities to hide and show content:
  - breakpoint "only" - `.[show/hide]-[breakpoint]`
  - breakpoint "min" - `.[show/hide]-[breakpoint]-up`
  - breakpoint "max" - `.[show/hide]-[breakpoint]-down`

- To remove/reset column positioning (offset, push, pull, center) use `.[breakpoint]-reset-order`.  

- To remove column gutter for specific columns use `.collapse-col-[breakpoint]`.


## Spacing <sub><sup>[file][spacing file]</sup></sub>

These classes work very similarly to how the grid classes work. Padding and margin can be changed at the small, medium and large breakpoints. It's best to apply these classes starting in the small range then only adding new ones when the spacing needs to be changed.

### Class Types

The general construction of a spacing class is `.[breakpoint]-[spacing type]-[side][spacing level]`.

So `.sm-pad-l5` means starting at the **small** breakpoint apply the **5th level** of **padding** to the **left side** of the element.

Spacing can be applied to the top, right, left, bottom, horizontal sides and vertical sides of an element. It can also be removed by setting the "level" to `0`. Spacing can be applied to all sides by leaving off the side specification (`.sm-pad-5`).

#### Examples
**NOTE**: These work the same for margin. Just substitute `pad` for `margin`.

```css
  // REALLY serious about removing all padding.
  .sm-pad-none {
    padding: 0 !important;
  }

  // Padding all around.
  .sm-pad-1 {
    padding:  1rem;
  }

  // Padding on the horizontal sides.
  .sm-pad-h1 {
    padding-left:  1rem;
    padding-right:  1rem;
  }

  // Padding on the vertical sides.
  .sm-pad-v1 {
    padding-top:  1rem;
    padding-bottom:  1rem;
  }

  // Padding on the top.
  .sm-pad-t1 {
    padding-top:  1rem;
  }

  // Padding on the right.
  .sm-pad-r1 {
    padding-right:  1rem;
  }

  // Padding on the bottom.
  .sm-pad-b1 {
    padding-bottom:  1rem;
  }

  // Padding on the left.
  .sm-pad-l1 {
    padding-left:  1rem;
  }

```

### Spacing Levels

| Levels 1-10 | Step of `5px` | Levels 11-25 | Step of `10px` |
|   :-----    |    :-----:    |    :-----    |    :-----:     |
| Level **0** |    `0 px`     |   Level **11**   |    `60 px`     |
| Level **1** |    `10 px`    |   Level **12**   |    `70 px`     |
| Level **2** |    `15 px`    |   Level **13**   |    `80 px`     |
| Level **3** |    `20 px`    |   Level **14**   |    `90 px`     |
| Level **4** |    `25 px`    |   Level **15**   |    `100 px`    |
| Level **5** |    `30 px`    |   Level **16**   |    `110 px`    |
| Level **6** |    `35 px`    |   Level **17**   |    `120 px`    |
| Level **7** |    `40 px`    |   Level **18**   |    `130 px`    |
| Level **8** |    `45 px`    |   Level **19**   |    `140 px`    |
| Level **9** |    `50 px`    |   Level **20**   |    `150 px`    |
| Level **10**|    `55 px`    |   Level **21**   |    `160 px`    |
|             |               |   Level **22**   |    `170 px`    |
|             |               |   Level **23**   |    `180 px`    |
|             |               |   Level **24**   |    `190 px`    |
|             |               |   Level **25**   |    `200 px`    |

## Text

### Alignment <sub><sup>[file][align file]</sup></sub>
We have classes for each breakpoint, structured `.txt-[alignment]-[breakpoint]` where `[alignment]` is either left, center, or right. These classes carry up breakpoints, so should be applied first at small and then modified on which breakpoint it has to be.

```css
.txt-left-sm {
  text-align: left;
}
.txt-center-md {
  text-align: center;
}
.txt-right-lg {
  text-align: right;
}
```

### Sizing <sub><sup>[file][size file]</sup></sub>
Our text size classes are based on the design standard and adapt themselves depending on the breakpoint. These classes also have built in line heights, again based on the breakpoint the view is at. The class construction is `.txt-size-[level]` and they should not require modifying for specific breakpoints.

**Note:** Superscript text is expected to be inside a `sup` tag and the content is expected to be an [HTML entity](https://dev.w3.org/html5/html-author/charref) representing the text. It is specifically sized and positioned per text level.

|  Size Level  |  sm  |  md  |  lg  | Line Height Notes |
|    :-----    | :--: | :--: | :--: |    :----------    |
|txt-size-**1**|`11px`|  ->  |  ->  | 1.8               |
|txt-size-**2**|`14px`|  ->  |  ->  | 1.8               |
|txt-size-**3**|`14px`|  ->  |`16px`| 1.8 up to max md  |
|txt-size-**4**|`14px`|`16px`|`18px`|  Small only 1.8   |
|txt-size-**5**|`16px`|`18px`|`20px`|   Standard 1.5    |
|txt-size-**6**|`18px`|`20px`|`24px`|   Standard 1.5    |
|txt-size-**7**|`20px`|`24px`|`30px`|   Standard 1.5    |
|txt-size-**8**|`24px`|`30px`|`36px`|   Standard 1.5    |

### Accent Text

There are three extra sizes of text that are used for accents in design. Primarily used for rates and pricing, they do not inherently resize like the other text sizing classes. Instead, they can be resized using their responsive naming. All accent text have `font-weight: 700` & `line-height: 1`.

|  Size Level  |  Font Size  |
|    :-----    | :--: |
|txt-accent-[breakpoint]-**1**|`40px`|
|txt-accent-[breakpoint]-**2**|`60px`|
|txt-accent-[breakpoint]-**3**|`80px`|

#### Rate & Currency Symbols

There are three symbols that can be used with rates and currency. They are relationally sized and positioned to be used inside any of our text size utilites. **It is not expected to use an HTML entity with these.**

* `.txt-percent`
* `.txt-dollar`
* `.txt-cents`

```html
<!-- Example of rate text. -->

<p class="txt-accent-sm-2">0.1<span class="txt-percent">%</span></p>
```

### Weight & Case

We also have some additional text [utilities](txt-sizing.scss#L171) including `font-weight` classes for light, bold, and extra bold text and an uppercase class.

```css
// Font weights
.txt-light {
	font-weight: 300;
}

// Should use "strong" if possible.
.txt-bold {
	font-weight: 700;
}

.txt-extra-bold {
	font-weight: 900;
}

// Uppercase
.txt-uppercase{
   text-transform: uppercase;
}
```

[border file]: borders.scss
[color file]: color-utils.scss
[display file]: display.scss
[grid file]: grid.scss
[spacing file]: spacing.scss
[align file]: txt-align.scss
[size file]: txt-sizing.scss
