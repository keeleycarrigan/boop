import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import asField from '../HOC/asField';

export function asSelect (Component) {
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

    handleOnChange = (e) => {
      const {
        fieldApi,
        multiple,
        onChange,
      } = this.props;

      const selected = [...this.selectRef.current]
        .filter(option => option.selected)
        .map(option => option.value);

      fieldApi.setValue(multiple ? selected : selected[0] || '');

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
        onChange,
        onBlur,
        field,
        initialValue,
        inputRef,
        children,
        multiple,
        ...rest
      } = props;

      return (
        <Component
          {...rest}
          errors={errors}
          hasError={errors && errors.length > 0}
          multiple={multiple}
          name={field}
          handleOnBlur={this.handleOnBlur}
          handleOnChange={this.handleOnChange}
          ref={this.selectRef}
          touched={touched}
          value={value || (multiple ? [] : '')}
        >
          {children}
        </Component>
      );
    }
  }

  DefaultSelect.propTypes = {
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

const BasicSelect = React.forwardRef((props, ref) => {
  const {
    children,
    field,
    handleOnBlur,
    handleOnChange,
    hasError,
    touched,
    ...rest
  } = props;

  return (
    <select
      {...rest}
      name={field}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      ref={ref}
    >
      {children}
    </select>
  );
});

export default asSelect(BasicSelect);