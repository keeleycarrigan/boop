momappoki Validator
==============

### Initialization

This component is initialized by passing in a form element (An optional options object can also be passed in)
```javascript
const validator = new momappoki.utilities.validator($('#form'), options);
```



&nbsp;
### Validator Options
An optional options object can be passed into the validator constructor. This object can contain custom error messages and validation methods.
Example:
```javascript
const options = {
    errorMessages: {
      currency: 'Please enter a valid amount.',
      selector: 'Make a selection to continue.'
    },
    inputValidators: {
      optionalNumber: (val) => {
        const intRegEx = new RegExp('^\\d+$');

        return intRegEx.test(val) || val === '';
      }
    }
  };
  ```
  ##### errorMessages
messages that will be displayed for different types of fields

Type: `object`  
Default:  [see 'current default error messages'](#current-default-error-messages)

##### inputValidators
messages that will be displayed for different types of fields

Type: `object`  
Default:  [see 'current default validation types'](#current-default-validation-types)

##### errorTemplate
the template used to insert error messages into the HTML

Type: `string`  
Default:  `<p class="basic-form-error-msg"><%= message%></p>`

##### errorTemplateWithIcon
the template used to insert error messages into the HTML

Type: `string`  
Default:  `<p class="${errorMsgClass}"><i class="icon-alert"></i> <%= message%></p>`

##### useErrorIcon
boolean that controls if the error message with icon is shown instead of the error message without icon

Type: `boolean`  
Default:  `false`

##### errorLimit
the number of error messages that will be inserted into the DOM per field

Type: `number`  
Default:  `1`



&nbsp;
### Validator Methods

##### validateSingleInput
Checks the input against the given validators; if the value is not valid, adds errors to the validator's `fieldData` and returns a boolean indicating validity.
The force argument is an optional boolean indicating if hidden fields should be validated.

*Note: this will spit out an error in debug mode if the data-validator fields are not valid JSON.*

Arguments: $el: `jQuery Object` force: `boolean`  
Returns: `boolean`

##### validateForm
Runs the `validateSingleInput` method on each input in the form. Does not automatically display error messages.

Arguments: `none`  
Returns: `none`

##### insertErrorIntoDom
This method inserts errors into the dom at the error target object. Optional arguments include the ability to show or not show error messages and to include custom error messages.

Arguments: $el: `jQuery Object`  showMessages: `boolean` (default true) errorMessage: `string`  
Returns: `none`

##### insertFormErrorsIntoDom
Goes through the entire form, running `resetErrorState`, `validateSingleInput` and `insertErrorIntoDom` on  each element. Optional argument includes the ability to show or not show error messages

Arguments: showMessages: `boolean` (default true)  
Returns: `none`

##### resetErrorState
Removes the validator's stored errors for the given input and removes the corresponding error class from the DOM

Arguments: $el: `jQuery Object`  
Returns: `none`

##### resetFormErrorState
Runs the `resetErrorState` method on each input in the form.

Arguments: `none`  
Returns: `none`

##### hasErrors
Returns a boolean indicating if the form contains any inputs with error classes.

Arguments: `none`  
Returns: `boolean`

##### getValues
Returns an object containing all the inputs and values. Useful in interacting with an API for passing on form information.

Arguments: `none`  
Returns:  `object`

##### getInputErrorMessages
Returns an array containing all the current error messages for an input.

Arguments: $el `jQuery object`  
Returns:  `array`

##### getFormErrorMessages
Runs `getInputErrorMessages` on each element in the form and returns an array of all the error messages - only unique messages if the boolean argument is `true` and all messages if the argument is `false` or omitted.

Arguments: unique `boolean`  
Returns:  `array`

&nbsp;

&nbsp;
### Passing options in through the HTML
The validator will find and use the `data-validator` attribute on each input (form) or the passed in individual input. The `data-validator` attribute must equal valid JSON. 

An example:
```json
{
  "type": "email",
  "validators": [
    "required",
    "email"
  ],
  "errorMessages" : {
    "empty": "You must enter a title.",
    "invalid": "You must enter a correct title"
  }
}
```

### Error Message Content
The validator will select an error message based on the `type` of the input. The `type` passed into the `data-validator` attribute will take precedence over the `type` attribute on the html element.  
 
Custom types, with custom error messages, can be passed in through the `options` object. Custom error messages can also be put in through the `insertErrorIntoDom` method.

### HTML and Error Message Location

The validator first finds a parent for the input element. This parent is either the nearest ancestor with a `data-error-wrapper` attribute or the nearest parent `fieldset` element.

Errors will be inserted into the element within the parent with a `data-error-target` attribute corresponding with the element, or in the absence of such an element, be inserted into the parent.

Sample HTML:
```html
<fieldset class="lg-col-3 sm-col-12 sm-margin-v1" data-error-wrapper>
  <label for="income" class="basic-label">Income</label>
  <input class='basic-input' type="text" max-length="12" name="income" id="income" value="$" data-validator='{"type":"currency", "validators":["required", "integers"]}'>
  <div class='row'>
    <div class="lg-col-12 sm-col-12" data-error-target='income'></div>
  </div>
</fieldset>
 ```
 &nbsp;


 &nbsp;
 ### Current Default Error Messages
 Here is a list of current default error messages that will be used if the `type` option is used and there is no `errorMessages` option:
 ```javascript
 generic: 'Please enter a valid input.',
 firstName: 'Please enter a valid first name.',
 lastName: 'Please enter a valid last name.',
 phone: 'Please enter a valid phone number.',
 email: 'Please enter a valid email address.'
```

 ### Current Default Validation Types
- **radio**
- **checkbox**
- **owasp**  (used as a filter for script injections)
- **email**
- **phone**
- **zipcode**
- **equals**
- **required**
- **integers**
- **min** amount passed in with json: `'{"validators":["min:100"]}'`
- **max** amount passed in with json: `'{"validators":["max:200"]}'`
- **range** amount passed in with json: `'{"validators":["range:100,200"]}'`
