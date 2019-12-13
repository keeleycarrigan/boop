# Elements Spacing

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

<!-- STORY -->
