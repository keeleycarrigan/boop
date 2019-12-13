import React from 'react';

import asRangeInput from 'Form/HOC/asRangeInput';

import RangeSlider from 'RangeSlider';
import RangeSliderTrack from 'RangeSlider/components/RangeSliderTrack';


const BasicRangeInput = React.forwardRef((props, ref) => {
  const {
    errors,
    handleOnBlur,
    handleOnChange,
    hasError,
    touched,
    ...rest
  } = props;

  return (
    <RangeSlider
      {...rest}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      hasError={errors && errors.length > 0}
      ref={ref}
    >
      <RangeSliderTrack />
    </RangeSlider>
  );
});

const RangeInput = asRangeInput(BasicRangeInput);

export default RangeInput;
