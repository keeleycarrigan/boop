import React from 'react';
import PropTypes from 'prop-types';

import asField from 'Form/HOC/asField';

function asTextField(Component, displayName = 'TextInput') {
  function DefaultTextInput({ fieldApi, fieldState, ...props }) {
    const {
      errors,
      touched,
      value,
    } = fieldState;
    const {
      errorLimit,
      field,
      initialValue,
      inputRef,
      maskOnChange,
      name,
      onBlur,
      onChange,
      ...rest
    } = props;
    const hasError = errors && errors.length > 0;
    const handleOnChange = (e) => {
      fieldApi.setValue(e.target.value);

      onChange(e);
    }

    const handleOnBlur = (e) => {
      fieldApi.setTouched();
      onBlur(e);
    }

    return (
      <Component
        {...rest}
        aria-invalid={hasError}
        errors={errors}
        handleOnBlur={handleOnBlur}
        handleOnChange={handleOnChange}
        hasError={hasError}
        name={name || field}
        ref={inputRef}
        touched={touched}
        value={typeof (value) === 'undefined' ? '' : value}
      />
    );
  }

  DefaultTextInput.propTypes = {
    field: PropTypes.string.isRequired,
    /**
     * Sets's the initial value of the input.
     * Will override values set at the global Form level.
     * */
    initialValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    name: PropTypes.string,
    /**
     * A list of other field names that should be
     * notified when the value of this field changes or
     * its error state changes. A notified field can
     * process this notification by applying one of its
     * validation rules.
    */
    notify: PropTypes.arrayOf(PropTypes.string),
    /**
     * A masking function that is passed the value as the
     * user has input it and should return the processed
     * value to set the input to. If "maskOnChange" isn't
     * set to true the mask will apply on input blur.
    */
    mask: PropTypes.func,
    maskOnChange: PropTypes.bool,
    /** Fires when input is blurred. */
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    /**
     * Option to pass an array of validation objects,
     * a singular validation object, or boolean indicating
     * whether the field should be validated. The boolean
     * option will only do basic validation to check if the
     * field has a value. The validation object should have
     * the following shape:
     * 
     * {
     *    errorMsg: 'Error Message',
     *    test: [validation function]
     * }
     * 
     * A validation function is passed the value of the input
     * as well as the value of all other form inputs.
     * */
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object,
    ]),
  }

  DefaultTextInput.defaultProps = {
    maskOnChange: false,
    onBlur: () => { },
    onChange: () => { },
  }

  return asField(DefaultTextInput, displayName);
}

export default asTextField;
