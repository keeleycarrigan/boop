# Elements Box

The `Box` component is meant as a general purpose layout container. Best practice would be to use them in columns as the `Box` doesn't have any inherent sizing attributes.

### Spacing Attributes
Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`.
- `padding`, `margin`: applies padding or margin on all sides of the element at the breakpoints specified in the size specified. Units should be passed as number of pixels but will be automatically converted to rems. 
- `paddingX`, `marginX`: applies padding or margin to the left and right of the element.
- `paddingY`, `marginY`: applies padding or margin to the top and bottom of the element.
- `paddingTop`, `marginTop`: applies padding or margin to the top of the element.
- `paddingRight`, `marginRight`: applies padding or margin to the right of the element.
- `paddingBottom`, `marginBottom`: applies padding or margin to the bottom of the element.
- `paddingLeft`, `marginLeft`: applies padding or margin to the left of the element.

```js
<Box
    padding={{ small: 10, large: 30 }}
    marginBottom={{ smallOnly: 20 }}
>
    {...}
</Box>
```

### Display Attributes
Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`.
- `display`: sets the `display` type of the element at the breakpoints specified. All valid `display` types can be applied. 
- `flex`: sets the `flex` value of the element at the breakpoints specified. All valid `flex` values can be applied. 

```js
<Box
    display={{ mediumMax: 'none', large: 'flex' }}
    flex={{ large: 2 }}
>
    {...}
</Box>
```

### Alignment Attributes
Can be specified for all breakpoints including the "Max" and "Only" versions. For example, `mediumMax` or `largeOnly`. Core flex alignment properties available. `align`, `alignSelf`, `alignContent`, `direction`, `justify`.

```js
<Box
    display={{ small: 'flex' }}
    justify={{ large: 'center' }}
>
    {...}
</Box>
```

### Color Attributes
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
