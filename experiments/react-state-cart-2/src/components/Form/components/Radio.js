import React from 'react';
import PropTypes from 'prop-types';

import { withGroup } from '../HOC/with';

export function asRadio (Component) {
  function DefaultRadio({ fieldApi, fieldState, groupApi, isGroup, ...props }) {
    const { value: groupValue } = fieldState;
    const {
      setValue,
      setTouched,
    } = fieldApi;
    const {
      onChange: groupOnChange,
      onBlur: groupOnBlur
    } = groupApi;
    const {
      field,
      initialValue,
      inputRef,
      multiselect, // unused by radios
      onBlur,
      onChange,
      value,
      ...rest
    } = props;

    const handleOnChange = (e) => {
      if (e.target.checked) {
        setValue(value);
        onChange(e);
        groupOnChange(e);
      }
    };
    const handleOnBlur = (e) => {
      setTouched();
      groupOnBlur(e);
      onBlur(e);
    };
    return (
      <Component
        {...rest}
        checked={groupValue === value}
        handleOnBlur={handleOnBlur}
        handleOnChange={handleOnChange}
        name={field}
        ref={inputRef}
        type="radio"
        value={value}
      />
    );
  };

  DefaultRadio.propTypes = {
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object,
    ]),
  }

  DefaultRadio.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
    groupApi: {
      onBlur: () => { },
      onChange: () => { },
    },
  }

  return withGroup(DefaultRadio);
}

const BasicRadio = React.forwardRef((props, ref) => {
  const {
    handleOnBlur,
    handleOnChange,
    id,
    ...rest
  } = props;

  return (
    <input
      {...rest}
      id={id}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      ref={ref}
    />
  )
});

export default asRadio(BasicRadio);