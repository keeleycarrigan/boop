import React from 'react';

import asSubmitButton from 'Form/HOC/asSubmitButton';

const BasicSubmit = React.forwardRef((props, ref) => {
  const {
    children,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      ref={ref}
    >
      {children}
    </button>
  )
});

export default asSubmitButton(BasicSubmit);
