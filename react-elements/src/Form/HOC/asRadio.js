import React from 'react';
import PropTypes from 'prop-types';

import withGroup from 'Form/HOC/withGroup';
import { namedField } from 'Form/HOC/asField';

export default function asRadio(Component, customName = 'Radio') {
  function DefaultRadio({ fieldApi, fieldState, groupApi, isGroup, ...props }) {
    const { value: groupValue } = fieldState;
    const {
      setValue,
      setTouched,
    } = fieldApi;
    const {
      field: groupField,
      name: groupName,
      onBlur: groupOnBlur,
      onChange: groupOnChange,
    } = groupApi;
    const {
      field,
      initialValue,
      inputRef,
      multiselect, // unused by radios
      name,
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
        name={groupName || groupField}
        field={groupField}
        ref={inputRef}
        type="radio"
        value={value}
      />
    );
  };

  DefaultRadio.propTypes = {
    name: PropTypes.string,
    notify: PropTypes.arrayOf(PropTypes.string),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  }

  DefaultRadio.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
    groupApi: {
      onBlur: () => { },
      onChange: () => { },
    },
  }

  return namedField(withGroup(DefaultRadio), customName);
}
