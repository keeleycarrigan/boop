import React, {
  PureComponent,
} from 'react';
import _isEqual from 'lodash/isEqual';
import _isPlainObject from 'lodash/isPlainObject';
import _merge from 'lodash/merge';
import _pick from 'lodash/pick';

import { validHasInput } from '@momappoki/elements-utils/Validation';

import FieldController  from 'Form/controllers/FieldController';
import withFormConnection from 'Form/HOC/withFormConnection';
import { buildFieldState } from 'Form/HOC/withFieldState';
import { buildFieldApi } from 'Form/HOC/withFieldApi';

function getDefaultValidator (validate) {
  if (typeof(validate) === 'boolean' && validate) {
    return [{
      errorMsg: 'Field required',
      test: validHasInput,
    }];
  } else if (_isPlainObject(validate)) {
    return [ validate ];
  } else {
    return validate || [];
  }
}

const bindToField = Component =>
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

        this.state = _merge({}, buildFieldState(formApi, field), initialValue ? { value: initialValue } : {});
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
        const prevDelegate = _pick(prevProps, controllerItems);
        const newDelegate = _pick(this.props, controllerItems);

        if (!_isEqual(prevDelegate, newDelegate)) {
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

export default bindToField;

