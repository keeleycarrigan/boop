import React from 'react';

const FormContext = React.createContext();
const GroupContext = React.createContext();

export const FormProvider = FormContext.Provider;
export const FormConsumer = FormContext.Consumer;

export {
  FormContext,
  GroupContext,
}