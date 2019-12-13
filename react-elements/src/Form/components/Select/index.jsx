import React from 'react';

import asSelect from 'Form/HOC/asSelect';
import {
  SelectArrow,
  SelectInput,
  SelectWrapper,
  SelectArrowImage,
} from 'Form/components/Select/styles';

const BasicSelect = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    disabled,
    errors,
    field,
    handleOnBlur,
    handleOnChange,
    hasError,
    touched,
    ...rest
  } = props;

  return (
    <SelectWrapper
      className={className}
      disabled={disabled}
      hasError={hasError}
    >
      <SelectInput
        {...rest}
        name={field}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        ref={ref}
      >
        {children}
      </SelectInput>
      <SelectArrow>
        <SelectArrowImage xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
        </SelectArrowImage>
      </SelectArrow>
    </SelectWrapper>
  );
});

export default asSelect(BasicSelect);
