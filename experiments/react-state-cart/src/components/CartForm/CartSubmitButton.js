import React from 'react';
import Button from '@material-ui/core/Button';

import { asSubmitButton } from '@momappoki/elements/Form/components/SubmitButton';

const CartSubmitButton = React.forwardRef((props, ref) => {
  const {
    children,
    ...rest
  } = props;

  return (
    <Button
      variant={'contained'}
      color={'primary'}
      ref={ref}
      {...rest}
    >
      {children}
    </Button>
  )
});

export default asSubmitButton(CartSubmitButton);
