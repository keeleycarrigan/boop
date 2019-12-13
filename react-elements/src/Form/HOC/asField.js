import React from 'react';

import Field from 'Form/components/Field';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function asField(Component, customName) {
  const displayName = customName || getDisplayName(Component);
  const AsField = props => <Field component={Component} { ...props} />;

  return namedField(AsField, displayName);
};

export function namedField(Component, customName) {
  const displayName = customName || getDisplayName(Component);
  Component.displayName = 'Wrapper';
  const NamedField = props => <Component {...props} />;

  NamedField.displayName = displayName;
  return NamedField;
};

export default asField
