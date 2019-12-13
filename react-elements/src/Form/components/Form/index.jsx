import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';

import FormController from 'Form/controllers/FormController';
import { FormProvider } from 'Form/Context';
import FormElement, {
  FormA11yErrorButton,
  FormA11yErrorContainer,
} from 'Form/components/Form/styles';

class Form extends PureComponent {
  constructor(props) {
    super(props);

    const {
      errorLimit,
      getApi,
      initialValues,
      onPreSubmit,
      onSubmit,
      onSubmitFailure,
      onSubmitSuccess,
      onValueChange,
      preventDefault,
    } = props;

    this.controller = new FormController({
      getApi,
      onPreSubmit,
      onSubmit,
      onSubmitSuccess,
      onSubmitFailure: (errors, eventData, api) => {
        const errorList = api.getErrors();

        this.setState({
          a11yErrors: api.getA11yErrorNodes(),
          formErrors: errorList,
        }, () => {
          const {
            key,
            type,
          } = eventData;

          if (errorList.length && type === 'keydown' && key === 'Enter') {            
            this.a11yErrorButtons[0].current.focus();
          }
        });
        onSubmitFailure(errors, errorList, api);
      },
      onValueChange,
    },
    {
      preventDefault,
      errorLimit,
      initialValues,
    });

    this.a11yErrorButtons = [];

    this.state = {
      a11yErrors: [],
      formErrors: [],
    }
  }

  get formContext() {
    return {
      controller: this.controller,
      formApi: {...this.controller.api},
      formErrors: this.state.formErrors,
      formState: this.controller.formState,
    };
  }

  get content() {
    const {
      children,
      component,
      render
    } = this.props;

    const props = this.formContext;

    if (component) {
      return React.createElement(component, props, children);
    }
    if (render) {
      return render(props);
    }
    if (typeof (children) === 'function') {
      return children(props);
    }
    return children;
  }

  renderA11yErrors(errors) {
    this.a11yErrorButtons = [];

    return errors.map((error, idx) => {
      const {
        errorMsg,
        node,
      } = error;
      const errorButtonRef = React.createRef();
      const clickError = (e) => {
        e.preventDefault();
        node.current.focus();
        this.a11yErrorButtons = [];
        this.setState({
          a11yErrors: []
        });
      };

      this.a11yErrorButtons.push(errorButtonRef);

      return (
        <FormA11yErrorButton
          key={`error-${idx}`}
          type={'button'}
          onClick={clickError}
          ref={errorButtonRef}
        >
          {errorMsg}
        </FormA11yErrorButton>
      );
    });
  }

  render() {
    const {
      children,
      component,
      errorLimit,
      getApi,
      initialValues,
      onChange,
      onPreSubmit,
      onSubmit,
      onSubmitFailure,
      onSubmitSuccess,
      onValueChange,
      preventDefault,
      render,
      ...props
    } = this.props;

    return (
      <FormProvider value={this.formContext}>
        <FormA11yErrorContainer>{this.renderA11yErrors(this.state.a11yErrors)}</FormA11yErrorContainer>
        <FormElement
          { ...props }
          onReset={ this.formContext.formApi.resetForm }
          onSubmit={ this.formContext.formApi.submitForm }
        >
          {this.content}
        </FormElement>
      </FormProvider>
    );
  }
}

Form.defaultProps = {
  preventDefault: true,
  onSubmitSuccess: () => {},
  onSubmitFailure: () => {},
};

Form.propTypes = {
  preventDefault: PropTypes.bool,
  errorLimit: PropTypes.number,
  /** Save a reference to the form API. */
  getApi: PropTypes.func,
  initialValues: PropTypes.object,
  onPreSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  onValueChange: PropTypes.func,
};

export default Form;
