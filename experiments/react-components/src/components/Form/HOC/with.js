import React, { PureComponent } from 'react';
import {
  isArray,
  isEqual,
  isPlainObject,
  merge,
  pick,
} from 'lodash';

import FieldController  from '../controllers/FieldController';
import { hasInput } from '../utilities/validation';
import {
  FormContext,
  GroupContext,
} from '../Context';

const buildFieldApi = (formApi, field) => {
  return ({
      getError: () => formApi.getError(field),
      getTouched: () => formApi.getTouched(field),
      getValue: () => formApi.getValue(field),
      setError: value => formApi.setError(field, value),
      setTouched: value => formApi.setTouched(field, value),
      setValue: value => formApi.setValue(field, value),
    })
};

const buildFieldState = (formApi, field) => {
  return {
    errors: formApi.getError(field),
    touched: formApi.getTouched(field),
    value: formApi.getValue(field),
  };
};


export const withFormConnection = Component =>
  React.forwardRef((props, ref) => (
    <FormContext.Consumer>
      {({ controller, formApi }) => {
        return (
          <Component controller={controller} formApi={formApi} ref={ref} {...props} />
        )
      }}
    </FormContext.Consumer>
  ));

export const withGroup = Component =>
  React.forwardRef((props, ref) => (
    <GroupContext.Consumer>
      {({ fieldApi, fieldState, groupApi, multiselect, }) => (
        <Component
          fieldApi={fieldApi}
          fieldState={fieldState}
          groupApi={groupApi}
          isGroup={true}
          multiselect={multiselect}
          ref={ref}
          {...props}
        />
      )}
    </GroupContext.Consumer>
  ));

export const withFormApi = Component =>
  React.forwardRef((props, ref) => (
    <FormContext.Consumer>
      {({ formApi }) => <Component formApi={formApi} ref={ref} {...props} />}
    </FormContext.Consumer>
  ));

export const withFieldApi = field => Component =>
  withFormApi(({ formApi, ...props }) => (
    <Component fieldApi={buildFieldApi(formApi, field)} {...props} />
  ));

export const withFieldState = field => Component =>
  withFormApi(({ formApi, ...props }) => (
    <Component fieldState={buildFieldState(formApi, field)} {...props} />
  ));


function getDefaultValidator (validate) {
  if (typeof(validate) === 'boolean' && validate) {
    return [{
      errorMsg: 'Field required',
      test: hasInput,
    }];
  } else if (isPlainObject(validate)) {
    return [ validate ];
  } else {
    return validate || [];
  }
}

export const bindToField = Component =>
withFormConnection(
  class FormConnection extends PureComponent {
    constructor(props) {
      super(props);
      const {
        asyncValidate,
        asyncValidateOnBlur,
        controller,
        errorLimit,
        field,
        formApi,
        inputRef,
        initialValue,
        mask,
        maskOnChange,
        notify,
        onValueChange,
        validate,
        validateOnBlur,
        validateOnChange,
        validateOnMount,
      } = props;

      this.field = inputRef || React.createRef();
      // Rebuild state when controller emits update
      // this happens on events such as submission
      const update = () => {
        this.setState(buildFieldState(formApi, field));
      };

      this.register = () => {
        this.fieldController = new FieldController(
        {
          api: this.fieldApi,
          config: {
            asyncValidateOnBlur,
            errorLimit,
            initialValue,
            mask,
            maskOnChange,
            notify,
            validateOnBlur,
            validateOnChange,
            validateOnMount,
          },
          delegate: {
            asyncValidate,
            onValueChange,
            update,
            validate: getDefaultValidator(validate),
          },
            field,
            node: this.field,
          }
        );

        controller.addField(field, this.fieldController);
      };

      this.deregister = () => {
        controller.removeField(field);
      };

      this.state = merge({}, buildFieldState(formApi, field), initialValue ? { value: initialValue } : {});
      this.fieldApi = buildFieldApi(formApi, field);
    }

    componentDidUpdate(prevProps) {
      const controllerItems = [
        'asyncValidate',
        'asyncValidateOnBlur',
        'errorLimit',
        'initialValue',
        'mask',
        'maskOnChange',
        'notify',
        'onValueChange',
        'validate',
        'validateOnBlur',
        'validateOnChange',
        'validateOnMount',
      ];
      const prevDelegate = pick(prevProps, controllerItems);
      const newDelegate = pick(this.props, controllerItems);

      if (!isEqual(prevDelegate, newDelegate)) {
        const {
          asyncValidate,
          asyncValidateOnBlur,
          errorLimit,
          initialValue,
          mask,
          maskOnChange,
          notify,
          onValueChange,
          validate,
          validateOnBlur,
          validateOnChange,
          validateOnMount,
        } = this.props;

        this.fieldController.updateProps({
          config: {
            asyncValidateOnBlur,
            errorLimit,
            initialValue,
            mask,
            maskOnChange,
            notify,
            validateOnBlur,
            validateOnChange,
            validateOnMount,
          },
          delegate: {
            asyncValidate,
            onValueChange,
            validate: getDefaultValidator(validate),
          }
        });
      }
    }

    render() {
      const {
        asyncValidate,
        asyncValidateOnBlur,
        controller,
        formApi,
        formState,
        inputRef,
        mask,
        onValueChange,
        validate,
        validateOnBlur,
        validateOnChange,
        validateOnMount,
        ...props
      } = this.props;

      return (
        <Component
          register={this.register}
          deregister={this.deregister}
          fieldApi={this.fieldApi}
          fieldState={this.state}
          inputRef={this.field}
          {...props}
        />
      );
    }
  }
  );

