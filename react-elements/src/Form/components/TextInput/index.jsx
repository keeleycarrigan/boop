import React from 'react';

import asTextField from 'Form/HOC/asTextField';
import TextInputElement from 'Form/components/TextInput/styles';

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
    <TextInputElement
      {...rest}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      hasError={errors && errors.length > 0}
      ref={ref}
    />
  );
});

const TextInput = asTextField(BasicTextInput);

export default TextInput;
