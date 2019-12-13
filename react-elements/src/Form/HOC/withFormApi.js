import { FormContext } from 'Form/Context';

const withFormApi = Component =>
  React.forwardRef((props, ref) => (
    <FormContext.Consumer>
      {({ formApi }) => <Component formApi={formApi} ref={ref} {...props} />}
    </FormContext.Consumer>
  ));

  export default withFormApi;
