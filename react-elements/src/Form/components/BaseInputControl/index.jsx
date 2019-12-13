import React from 'react';

import {
  BaseInputControlWrapper,
  BaseInputControlInput,
  BaseInputControlLabel,
} from 'Form/components/BaseInputControl/styles';

const BaseInputControl = React.forwardRef((props, ref) => {
  const {
    checked,
    className,
    controlIcon: ControlIcon,
    field,
    id,
    label,
    style,
    ...rest
  } = props;

  return (
    <BaseInputControlWrapper
      className={className}
      htmlFor={ id || field }
      style={style}
    >
      <ControlIcon checked={ checked } />
      <BaseInputControlInput
        id={ id }
        checked={ checked }
        { ...rest }
        ref={ ref }
      />
      <BaseInputControlLabel>{ label }</BaseInputControlLabel>
    </BaseInputControlWrapper>
  )
});

export default BaseInputControl;
