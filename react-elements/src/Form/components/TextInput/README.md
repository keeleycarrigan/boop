# TextInput

<!-- STORY -->

| Name               | Type     | Default  | Required | Description                                                                                                                           |
|:-------------------|:--------:|:--------:|:--------:|---------------------------------------------------------------------------------------------------------------------------------------|
| field | `string`  |     |     Yes     | Used as the field's identifier in the form's `values` object. By default it is also used as the input's `name` attribute, but this can be overridden. It also represents the object path for the value to be set in the form's `values` object. <br><br> Ex: `'something.person'` will be saved as `{ something: { person: 'whatever value' } }`.  |
| initialValue               | `number`/`string`     |  |  | Sets's the initial value of the input. Will override values set at the global Form level. |
| notify               | `array`     |  |  | A list of other field names that should be notified when the value of this field changes or its error state changes. A notified field can process this notification by applying one of its validation rules. |
| mask               | `function`     |  |  | A masking function that is passed the value as the user has input it and should return the processed value to set the input to.If `maskOnChange` isn't set to true the mask will apply on input blur. |
| maskOnChange               | `boolean`     | false |  | Sets if the input mask should be run on every value change. |
| onBlur               | `function`     | () => {} |  | Callback fired when input is blurred. <br>Arguments: (`event`) |
| onChange               | `function`     | () => {} |  | Callback fired on every value change. <br>Arguments: (`event`) |
| validate               | `array`/`object`/`boolean`     |  |  | Option to pass an array of validation objects, a singular validation object, or boolean indicating whether the field should be validated. The boolean option will only do basic validation to check if the field has a value. The validation object should have the following shape: <br><br> ` { errorMsg: 'Error Message', test: [validation function] }` <br><br> A validation function is passed the value of the input as well as the value of all other form inputs. |