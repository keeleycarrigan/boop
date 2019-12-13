import React from 'react';
import PropTypes from 'prop-types';

import asField from '../HOC/asField';

export function asTextField(Component, displayName = 'TextInput') {
  function DefaultTextInput({ fieldApi, fieldState, ...props }) {
    const {
      errors,
      touched,
      value,
    } = fieldState;
    const {
      errorLimit,
      field,
      inputRef,
      initialValue,
      maskOnChange,
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
        hasError={hasError}
        name={field}
        handleOnBlur={handleOnBlur}
        handleOnChange={handleOnChange}
        ref={inputRef}
        touched={touched}
        value={typeof (value) === 'undefined' ? '' : value}
      />
    );
  }

  DefaultTextInput.propTypes = {
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object,
    ]),
  }

  DefaultTextInput.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
  }

  return asField(DefaultTextInput, displayName);
}

const BasicTextInput = React.forwardRef((props, ref) => {
  const {
    errors,
    handleOnBlur,
    handleOnChange,
    hasError,
    touched,
    ...rest
  } = props;

  return (
    <input
      {...rest}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      ref={ref}
    />
  );
});

export default asTextField(BasicTextInput);
