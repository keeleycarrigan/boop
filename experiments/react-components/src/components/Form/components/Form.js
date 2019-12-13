import React, {
  PureComponent,
} from 'react';
import ReactDOM from 'react-dom';
import { get } from 'lodash';

import FormController from '../controllers/FormController';
import {
  FormContext,
} from '../Context';
import {
  FormA11yErrorContainer,
  FormA11yErrorButton,
} from './styles';

export default class Form extends PureComponent {
  constructor(props) {
    super(props);

    const {
      dontPreventDefault,
      errorLimit,
      getApi,
      initialValues,
      onSubmit,
      onSubmitFailure,
      preSubmit,
    } = props;

    this.controller = new FormController({
      getApi,
      onSubmit,
      onSubmitFailure: (errorList, eventData, api) => {
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
        onSubmitFailure(errorList, api);
      },
      preSubmit,
    },
    {
      dontPreventDefault,
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
      dontPreventDefault,
      errorLimit,
      getApi,
      initialValues,
      onChange,
      onSubmitFailure,
      onSubmitSuccess,
      onValueChange,
      preSubmit,
      render,
      ...props,
    } = this.props;

    return (
      <FormContext.Provider value={this.formContext}>
        <FormA11yErrorContainer>{this.renderA11yErrors(this.state.a11yErrors)}</FormA11yErrorContainer>
        <form {...props}
          onReset={this.formContext.formApi.reset}
          onSubmit={this.formContext.formApi.submitForm}
        >
          {this.content}
        </form>
      </FormContext.Provider>
    );
  }
}

Form.defaultProps = {
  onSubmitSuccess: () => {},
  onSubmitFailure: () => {},
}
