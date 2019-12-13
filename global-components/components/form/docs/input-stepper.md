# Input Stepper

## Usage
An input with increment and decrement controls on either side of it. For use with specific steps over a set range. Leverages an input mask to control the formatted appearance of the input, as well as accessing and updating the value correctly.

## Example/Basic HTML
````HTML
<div class="basic-stepper-input" data-input-stepper data-input-stepper-opts="{"formatOnInput": true, "suffix": "%"}">
  <button class="basic-stepper-input-btn" type="button" aria-label="Decrease Increment Stepper by $50" data-input-stepper-decrease="inc-stepper" aria-disabled="false">
    <i class="momacon-glyph-minus" aria-hidden="true"></i>
  </button>
  <input type="text" name="inc-stepper" id="inc-stepper" class="basic-input" data-input-stepper-field="" aria-live="polite" value="50">
  <button class="basic-stepper-input-btn" type="button" aria-label="Increase Increment Stepper by $50" data-input-stepper-increase="inc-stepper" aria-disabled="false"><i class="momacon-glyph-plus" aria-hidden="true"></i></button>
</div>
````

## Options
Generally, input-steppers will be picked up by the global `bootstrap.js`, options are then expected to be established on the `input-stepper-opts` attribute. You may opt out of that global initialization by not including the `data-input-stepper` attribute in your HTML, though it will be added in by the component itself when it is initialized. \
Note, many of the options are simply passed to an internal inputMask initialization so more specific details can be found [here.](./input-mask)

````Js
const options = {
  commas: true,
  decimals: 0,
  disableKeyboardInput: false,
  formatOnInput: false,
  incStep: 50,
  decStep: 50,
  min: 0,
  max: 1000, // Should be set on input
  prefix: '', // '$', etc.
  suffix: '', // '%', etc.
  onIncrement: $.noop,
  onDecrement: $.noop,
  onChange: $.noop
}
````

### InputMask only Options
These are all documented within the input mask.
>commas, decimals, disableKeyboardInput, formatOnInput, prefix, suffix

### InputStepper Options
#### Can be passed through data-input-stepper-opts
- incStep
  - The amount by which the value increases.
- decStep
  - The amount by which the value decreases.
- min
  - The lower limit of the input, this is used to disable the decrement button and is passed on to the Input Mask to ensure the value is always between the set limits.
- max
  - The upper limit of the input, this is used to disable the increment button and is passed on to the Input Mask to ensure the value is always between the set limits.

##### Cannot be passed through data-input-stepper-opts
 If your component is not initialized through the bootstrap(_weird, maybe check on that_) then you can pass in callback functions through the options in the javascript initialization.

- onIncrement
  - When the increment button is pressed
- onDecrement
  - When the decrement button is pressed
- onChange
  - Whenever the input is changed, either increase or decrease.

_Note:_ Each of these callbacks also have events that are published at `momappoki.inputStepper.${EventName}` where the EventName matches the callback names above.
