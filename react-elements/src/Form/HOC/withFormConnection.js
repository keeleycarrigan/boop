import React from 'react';

import { FormContext } from 'Form/Context';

const withFormConnection = Component =>
  React.forwardRef((props, ref) => (
    <FormContext.Consumer>
      {({ controller, formApi }) => {
        return (
          <Component controller={controller} formApi={formApi} ref={ref} {...props} />
        )
      }}
    </FormContext.Consumer>
  ));

  export default withFormConnection;
  