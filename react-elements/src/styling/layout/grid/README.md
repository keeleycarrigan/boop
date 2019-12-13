# Elements Grid

A pretty standard grid with all the normal rules that most other grids like Bootstrap or Foundation follow.

1. Start with a `Row`.
2. Offsets and `Column` widths should equal the total number of columns. Default is 12.
3. When nesting `Column`s, start over with a `Row` and give it a `nest` attribute.

The Grid is made of two main components:

#### Row

Acts as the main content width limiter and method of nesting columns.

#### Column

Main layout container for content. All content inside a `Row` should be inside a `Column`. Even if the content is always 100% width use a `Column`. This keeps outside spacing and alignment consistent.

## Grid Attributes

Most attributes with the exception of `nest` will use the breakpoints created from the main style settings. You can customize the breakpoints by passing custom settings into the `ElementsTheme` theme provider. The breakpoint names should be used as key names for the object passed into these attributes.

### `cols` (elements: `Column`)
Sets the number of columns for specified breakpoints. Without a `cols` attribute a `Column` will be 100% by default. Only uses the main breakpoint names and "lower" setting for that breakpoint. So by default your can specify breakpoints for `small`, `medium`, `large`, `xlarge`.  

**Note:** It's only necessary to pass column widths for breakpoints where the column number changes. See below where we want 12 columns `small`->`medium` and then 6 columns `medium`->`xlarge`.

```js
<Column
    cols={{ medium: 6 }}
>
    {...}
</Column>
<Column
    cols={{ medium: 6 }}
>
    {...}
</Column>
```

### `offsetCols` (elements: `Column`)
Sets the number of **offset** columns for specified breakpoints. Offset columns start from the left and  should be taken into account when adding column numbers as you can see in the example below. At the `medium` breakpoint these two columns are each 50% wide. Then at `large` the first column gains 6 columns of offset so there isn't enough room for the second column to fit. Because of this, the second column drops down and we make is 12 columns because now it can take up the full width. By default your can specify breakpoints for `small`, `medium`, `large`, `xlarge`.  

**Note:** Offset columns and other `Column` elements' `cols` don't **have** to add up to the max number of columns. If you want offset, but don't need the `Column` to take up the rest of the room that's completely fine. The remaining columns can be used by other `Column` elements or open space.

```js
<Column
    cols={{ medium: 6 }}
    offsetCols={{ large: 6 }}
>
    {...}
</Column>
<Column
    cols={{ medium: 6, large: 12 }}
>
    {...}
</Column>
```

### Spacing Attributes (elements: `Row`, `Column`)
Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`.
- `padding`, `margin`: applies padding or margin on all sides of the element at the breakpoints specified in the size specified. Units should be passed as number of pixels but will be automatically converted to rems. 
- `paddingX`, `marginX`: applies padding or margin to the left and right of the element.
- `paddingY`, `marginY`: applies padding or margin to the top and bottom of the element.
- `paddingTop`, `marginTop`: applies padding or margin to the top of the element.
- `paddingRight`, `marginRight`: applies padding or margin to the right of the element.
- `paddingBottom`, `marginBottom`: applies padding or margin to the bottom of the element.
- `paddingLeft`, `marginLeft`: applies padding or margin to the left of the element.

```js
<Column
    padding={{ small: 10, large: 30 }}
    marginBottom={{ smallOnly: 20 }}
>
    {...}
</Column>
```

### Display Attributes (elements: `Row`, `Column`)
Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`.
- `display`: sets the `display` type of the element at the breakpoints specified. All valid `display` types can be applied. 
- `flex`: sets the `flex` value of the element at the breakpoints specified. All valid `flex` values can be applied. 

```js
<Column
    display={{ mediumMax: 'none', large: 'flex' }}
    flex={{ large: 2 }}
>
    {...}
</Column>
```

### Alignment Attributes (elements: `Row`, `Column`)
Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`. Core flex alignment properties available. `align`, `alignSelf`, `alignContent`, `direction`, `justify`.

```js
<Column
    display={{ small: 'flex' }}
    justify={{ large: 'center' }}
>
    {...}
</Column>
```

### Color Attributes (elements: `Row`, `Column`)
There are two color attributes `bgColor` (background color) and `color` (font color). These are not associated with breakpoints so the value given should just be a string representing your color.

Available colors should come from the `colors` key set in the main settings object. The usable color names are created from the structure and keys used in the `colors` object. The reason these color names must be set as the project's default colors is so that random colors aren't used and only approved colors from the style guide can be used.

For example:

```js
{
    colors: {
        grayScale: {
            black: '#000',
            gray1: '#DDD',
            gray2: '#CCC',
            gray3: '#999',
            ...others
        },
        bright: {
            red: '#FF1010',
            blue: '#00B4FF'
        }
    }
}

```

This will generate color names like:
- `grayScaleBlack`
- `grayScaleGray2`
- `brightRed`
- `brightBlue`

<!-- STORY -->
