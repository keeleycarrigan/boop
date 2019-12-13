# Input Mask

## Usage

 Input mask can be used to control an input to be a formatted number, ensure it's field text conforms to intended visual specifics given, and that the clean number value is accessible for calculations and other manipulation. It also allows for an inputs format to be maintained simply even when programmatically setting the value many times.

---

## DOM Structure

Basic input structure, with optional `data-input-mask` and `data-input-mask-opts` attributes.

````HTML
<input type="text" name="inputToMask" id="inputToMask" data-input-mask data-input-mask-opts="{decimals: 2}">
````
While `data-input-mask` and `input-mask-opts` are both technically optional the first attribute is recommended due to easy selection.

---

## Initializing

InputMasks are not initialized by default. Either page specific or component code will be needed to use this component. There are a variety of options that can be passed in as well, though only the jQuery object is a required parameter.

````JS
// Options are shown with their default values
const options = {
  allowOutOfRangeValues: false,
  commas: true,
  decimals: 0,
  disableKeyboardInput: false,
  formatOnInput: true,
  formatWhenBlank: 'min', // 'none', 'prefix', 'suffix', 'max'
  min: 0,
  max: 9999999999999999,
  prefix: '', // '$', etc.
  suffix: '', // '%', etc.
  disableKeyTest (convertedKeyCode) {
    return convertedKeyCode.isEnter;
  },
  onBlur: $.noop,
  onKeydown: $.noop
}
const $el = $('#someInputSelector');
const inputMask = momappoki.components.InputMask($el, options)
````

## Options

#### allowOutOfRangeValues
**expects:** `boolean`

#### commas
**expects:** `boolean`\
This is used to format the value of the input by being passed into the format utility.

#### decimals
**expects:** `number`\
This is used to format the value of the input by being passed into the format utility.

#### disableKeyboardInput
**expects:** `boolean`

#### formatOnInput
**expects:** `boolean`

#### formatWhenBlank
**expects:** predefined strings\
**options:** 'none', 'prefix', 'suffix', 'max'\
Specifies how the input should look when it is emptied or starts empty.

#### min
**expects:** `number`\
Minimum number value for the input

#### max
**expects:** `number`\
Maximum number value for the input

#### prefix
**expects:** `string`\
Formatting option that is used for the formatting utility, to be prepended to the input's value.

#### suffix
**expects:** `string`\
Formatting option that is used for the formatting utility, to be appended to the input's value.

#### onBlur
**expects:** `Function`\
A custom callback that is fired, you guessed it, on an input's Blur event.

#### onKeydown
**expects:** `Function`\
A custom callback that is fired on the input's keyDown, even if `disableKeyboardInput` is `true`.

## Methods

### Static

#### getInstance ($el)
**parameter:** A jQuery object selecting your input. \
**returns:** The instance of `InputMask` that is stored on the element, or `undefined`.

### Instance

#### getCleanNumber (val)
**parameter:** A value, `string` or `number`, to be cleaned based on the input's decimal option.\
**returns:** A cleaned number.\
_Note:_ If no value is passed in, the method just returns the cleaned value of the masked input.
#### getFormattedValue (val)
**parameter:** A value to format based on the input's formatting options, ex: decimals, prefix, and suffix.\
**returns:** The formatted value.\
_Note:_ If there is no value passed in the method will use the `formatWhenBlank` option to determine which value should be used for the function.
#### setFormattedValue (val)
**parameter:** A value to set the input to.\
**returns:** The instance of InputMask that the method was called on.\
_Note:_ Uses the `getFormattedValue` method to format the value before it is set on the masked input, so there's no need to use both the get and the set yourself.
#### updateOptions (options={})
**parameter:** An object to be extended with the current options.
**returns:** undefined
_Note:_ Just a safe way to update instance options
