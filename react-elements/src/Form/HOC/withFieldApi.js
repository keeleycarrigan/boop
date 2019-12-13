import React from 'react';

export const buildFieldApi = (formApi, field) => ({
  getError: () => formApi.getError(field),
  getTouched: () => formApi.getTouched(field),
  getValue: () => formApi.getValue(field),
  setError: value => formApi.setError(field, value),
  setTouched: value => formApi.setTouched(field, value),
  setValue: value => formApi.setValue(field, value),
});

const withFieldApi = field => Component =>
  withFormApi(({ formApi, ...props }) => (
    <Component fieldApi={buildFieldApi(formApi, field)} {...props} />
  ));

export default withFieldApi;
