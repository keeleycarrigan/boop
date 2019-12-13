# Input Range
---

Mask an input to display a formatted value and limit the value to specified ranges.

---

## Initializing

Initializing an input as an input-range puts the instance of the class into the data of the element passed into the constructor. This allows access to class methods once elements have been selected using jQuery.

The range input will be auto initialized via the bootstrapper. However, if you need to programmatically initialize it, that option is available and explained below.

### Markup Structure
The markup below is the simplest markup structure to set up a range input.

```html
<label for="range-input" class="basic-label">Range Input</label>
<input type="range" class="basic-range-input" name="range-input" id="range-input" value="20" min="0" max="75" step="5" data-input-range role="slider" aria-valuemin="0" aria-valuemax="75" aria-valuenow="20">
<!--Optional Text Input-->
<input type="text" class="basic-input" name="range-txt-input" id="range-txt-input" data-input-mask-opts='{"decimals": 2}' data-input-range-field="range-input">
```
### Elements and Required Attributes
- **`input[type="range"]`** This is where the range slider will be initialized. 
  - The range type is a valid HTML5 input type.
    - `min`, `max`, and `step` are standard attributes for this input type. For more info, visit [w3schools](https://www.w3schools.com/html/html_form_input_types.asp).
      - These values can be set via options, but it is recommended to set them via the native attributes.
  - `[data-input-range]`
    - Used by the bootstrapper to initialize the element as an momappoki Range Input.
  - `[aria-*]`
    - Allows screen readers to parse the range attributes.

- **`input[type="text"]`** **`OPTIONAL`** This is where the slider's value is stored.
  - `[data-input-range-field="range-input"]` - The value of this attribute should be the id of the range input that you want this input associated with.
  - `[data-input-mask-opts='{"decimals": 2}']` - **OPTIONAL** If included, this will set the input mask options for the field. See Input Mask for more information.



### Class/Object Initialization
- This is the default class initialization. This will merge default options and `[data-input-range-opts]` attribute from the range element, if any are provided.
```js
const range = new momappoki.components.InputRange($el);
```

- If you choose not to pass options via the `input` using `[data-input-range-opts]`, youn may pass options programatically. You may pass any or all of these options to override defaults.

```js
const range = new momappoki.components.InputRange($el, {
    commas: true,
    decimals: 0,
    inputDecimals: 0,
    disableKeyboardInput: false,
    formatOnInput: false,
    leftColor: '#3798C7',
    rightColor: '#E5E5E5',
    setRangeColor: true,
    min: null, // Recommended to be set on input
    max: null, // Recommended to be set on input
    step: null, // Recommended to be set on input
    largeStep: 2,
    prefix: '', // '$', etc.
    suffix: '', // '%', etc.
    onIncrement: $.noop,
    onDecrement: $.noop,
    onChange: $.noop
  });
```
- Get an Input Range instance
````js
const rangeInst = momappoki.components.InputRange.getInstance($el);
````

## Options

- ### commas
  **Type:** `boolean`

  **Default:** `false`

  Passed to input mask. Used to parse/format numerical values with or without commas.

- ### decimals
  **Type:** `Integer`

  **Default:** `0`

  Used in rounding step change to closest value. The value here will be used to determine how many decimal places are included in rounded values.
  
- ### inputDecimals
  **Type:** `Integer`

  **Default:** `0`

 Passed to input mask. Controls amount of decimals in input values

  
- ### disableKeyboardInput
  **Type:** `boolean`

  **Default:** `false`

  Passed to input mask. 

- ### formatOnInput
  **Type:** `boolean`

  **Default:** `false`

  Passed to input mask. Used to determine if value should be formatted when it is input.

- ### leftColor
  **Type:** `String`

  **Default:** `#3798C7`

  Color choice for left side of slider when `setRangeColor` is set to true.

- ### rightColor
  **Type:** `String`

  **Default:** `#E5E5E5`

  Color choice for right side of slider when `setRangeColor` is set to true.

- ### setRangeColor
  **Type:** `boolean`

  **Default:** `false`
  Determines if color of slider will be updated as value changes

- ### min
  **Type:** `Integer`

  **Default:** `null`

  The minimum value for the range slider. 
  
  **NOTE** This SHOULD be set on the element as an attribute.

- ### max
  **Type:** `Integer`

  **Default:** `null`

  The maximum value for the range slider. 
  
  **NOTE** This SHOULD be set on the element as an attribute.

- ### step
  **Type:** `Integer`

  **Default:** `null`

  The incrememnt value for the slider. 
  
  **NOTE** This SHOULD be set on the element as an attribute.
  
- ### largeStep
  **Type:** `Integer`

  **Default:** `2`

  The step value used when pressing `pageup` or `pagedown`. If the step value is higher than the largeStep value, the largeStep is replaced by `step * 2`

- ### prefix
  **Type:** `String`

  **Default:** `''`

  Passed to input mask. Used to prepend symbols to the input value. i.e `$`

- ### suffix
  **Type:** `String`

  **Default:** `''`

  Passed to input mask. Used to append symbols to the input value. i.e `%`

- ### onIncrement
  **Type:** `Function`

  **Default:** `$.noop`

  Callback function that is fired when the range value is incremented.

  **NOTE** `Not currently implemented`

- ### onDecrement
  **Type:** `Function`

  **Default:** `$.noop`

  Callback function that is fired when the range value is decremented.

  **NOTE** `Not currently implemented`

- ### onChange
  **Type:** `Function`

  **Default:** `$.noop`

  Callback function for change

  **NOTE** `Not currently implemented`
