import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import asField from 'Form/HOC/asField';

function asSelect(Component) {
  class DefaultSelect extends PureComponent {
    constructor(props) {
      super(props);

      this.selectRef = props.inputRef || React.createRef();
    }

    componentDidUpdate(prevProps) {
      if (this.props.inputRef !== prevProps.inputRef) {
        this.selectRef = this.props.inputRef;
      }
    }

    setValue() {
      const {
        fieldApi,
        multiple,
      } = this.props;
      const selected = [...this.selectRef.current]
        .filter(option => option.selected)
        .map(option => option.value);
    
      fieldApi.setValue(multiple ? selected : selected[0] || '');
    }

    handleOnChange = (e) => {
      const {
        onChange,
      } = this.props;

      this.setValue();

      onChange(e);
    }

    handleOnBlur = (e) => {
      const {
        fieldApi,
        onBlur,
      } = this.props;

      fieldApi.setTouched();
      onBlur(e);
    }

    render() {
      const {
        fieldApi,
        fieldState,
        ...props
      } = this.props;
      const {
        errors,
        touched,
        value,
      } = fieldState;
      const {
        field,
        initialValue,
        inputRef,
        multiple,
        name,
        onBlur,
        onChange,
        ...rest
      } = props;
  
      return (
        <Component
          {...rest}
          errors={errors}
          hasError={!!(errors && errors.length > 0)}
          multiple={multiple}
          name={name || field}
          handleOnBlur={this.handleOnBlur}
          handleOnChange={this.handleOnChange}
          ref={this.selectRef}
          touched={touched}
          value={value || (multiple ? [] : '')}
        />
      );
    }
  }

  DefaultSelect.propTypes = {
    field: PropTypes.string.isRequired,
    /**
     * Value the input will have when the component
     * is initially rendered. Will override any form
     * level initial values set for this field.
     * */
    initialValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    /**
     * Should be a list of other field names that should be
     * notified when the value of this field changes or
     * its error state changes. A notified field can
     * process this notification by applying one of its
     * validation rules.
    */
    notify: PropTypes.arrayOf(PropTypes.string),
    /** Fires when input is blurred. */
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    /**
     * Option to pass an array of validation objects,
     * a singular validation object, or boolean indicating
     * whether the field should be validated. The boolean
     * option will only do basic validation to check if the
     * field has a value. The validation object should have
     * the following shape:
     *
     * {
     *    errorMsg: 'Error Message',
     *    test: [validation function]
     * }
     *
     * A validation function is passed the value of the input
     * as well as the value of all other form inputs.
   * */
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object,
    ]),
  };

  DefaultSelect.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
  };

  return asField(DefaultSelect);
}

export default asSelect;
