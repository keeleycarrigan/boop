# Form

<!-- STORY -->

| Name               | Type     | Default  | Required | Description                                                                                                                           |
|:-------------------|:--------:|:--------:|:--------:|---------------------------------------------------------------------------------------------------------------------------------------|
| preventDefault | boolean  | true    |          | Prevent's default form submission event from firing.                                                                                  |
| errorLimit         | number   | `null` |          | Sets the maximum number of validation errors that can come back per field. This can be overridden at the input level.                 |
| getApi             | function | () => {} |          | Gives the ability to capture the instance of the `FormController` so Form API methods can be run directly.                            |
| initialValues      | object   |     {}   |          | Set initial field values globally for form.                                                                                           |
| onPreSubmit        | function | () => {} |          | Gives the opportunity to process or transform values before they are passed to `onSubmitSuccess`. Arguments: (`formState`, `formAPI`) |
| onSubmitFailure    | function | () => {} |          | Callback on form submission and validation fails. Arguments: (`formErrorObject`, `formErrorList`, `formAPI`)                             |
| onSubmitSuccess    | function | () => {} |          | Callback on form submission and validation succeeds. Arguments: (`formValues`, `formSubmitEvent`, `formAPI`)                          |
| onValueChange      | function | () => {} |          | Callback when any input value changes. Arguments: (`formState`)                                                                       |
