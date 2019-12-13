import React from 'react';

export const buildFieldState = (formApi, field) => ({
  errors: formApi.getError(field),
  touched: formApi.getTouched(field),
  value: formApi.getValue(field),
});

const withFieldState = field => Component =>
  withFormApi(({ formApi, ...props }) => (
    <Component fieldState={buildFieldState(formApi, field)} {...props} />
  ));

export default withFieldState;
