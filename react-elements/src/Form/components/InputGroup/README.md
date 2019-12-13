# Input Group

An `InputGroup` is meant to contain a group of `Radio` or `GroupCheckbox` components. A group of `Radio` components will **always** be single select, but a `GroupCheckbox` group can choose to be `multiselect`.

<!-- STORY -->

| Name               | Type     | Default  | Required | Description                                                                                                                           |
|:-------------------|:--------:|:--------:|:--------:|---------------------------------------------------------------------------------------------------------------------------------------|
| field | `string`  |     |     Yes     | Used as the field's identifier in the form's `values` object. By default it is also used as the input's `name` attribute, but this can be overridden. It also represents the object path for the value to be set in the form's `values` object. <br><br> Ex: `'something.person'` will be saved as `{ something: { person: 'whatever value' } }`.  |
| initialValue               | `string`/`array`     |  |  | To pre-select an input, set as the input's `value`. Pass a `string` for groups that can only have one selection and pass an `array` for multiselect groups. |
| notify               | `array`     |  |  | A list of other field names that should be notified when the value of this field changes or its error state changes. A notified field can process this notification by applying one of its validation rules. |
| multiselect               | `boolean`     |  |  | Used only for groups of `GroupCheckbox`. Unless set to `false`, more than one `GroupCheckbox` can be selected at a time. Field value will be stored as an `array`. |
| onBlur               | `function`     | () => {} |  | Callback fired when input is blurred. <br>Arguments: (`event`) `target` will be the `input` that was blurred. |
| onChange               | `function`     | () => {} |  | Callback fired on every value change. <br>Arguments: (`event`) `target` will be the `input` that was changed. |
| validate               | `array`/`object`/`boolean`     |  |  | Option to pass an array of validation objects, a singular validation object, or boolean indicating whether the field should be validated. The boolean option will only do basic validation to check if the field has a value. The validation object should have the following shape: <br><br> ` { errorMsg: 'Error Message', test: [validation function] }` <br><br> A validation function is passed the value of the input as well as the value of all other form inputs. |