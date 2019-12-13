import React from 'react';
import PropTypes from 'prop-types';

import withGroup from 'Form/HOC/withGroup';
import asField, { namedField } from 'Form/HOC/asField';

function getGroupMultiselectVal(currentFormVal = [], isChecked, inputVal) {
  return isChecked ? [...currentFormVal, inputVal] : currentFormVal.filter(val => val !== inputVal);
}

export function asBasicCheckbox (Component) {
  function BasicCheckbox({ fieldApi, fieldState, multiselect, groupApi, isGroup, value: inputVal, ...props }) {
    const { value: formVal } = fieldState;
    const {
      field,
      inputRef,
      initialValue,
      ...rest
    } = props;

    function isChecked() {
      if (isGroup) {
        if (multiselect) {
          return formVal ? formVal.indexOf(inputVal) > -1 : false;
        } else {
          return formVal === inputVal;
        }
      }

      return !!formVal;
    }

    function handleOnChange(e) {
      const { onChange } = props;
      const isChecked = e.target.checked;
      let newVal;

      if (isGroup) {
        if (multiselect) {
          newVal = getGroupMultiselectVal(formVal, isChecked, inputVal);
        } else if (isChecked && !multiselect) {
          newVal = inputVal;
        }
      } else {
        if (inputVal) {
          newVal = isChecked ? inputVal : null;
        } else {
          newVal = isChecked;
        }
      }

      fieldApi.setValue(newVal);
      onChange(e);
      groupApi.onChange(e);
    }

    function handleOnBlur(e) {
      const {
        onBlur,
      } = props;

      fieldApi.setTouched();
      onBlur(e);
      groupApi.onBlur(e);
    };

    return (
      <Component
        {...rest}
        checked={isChecked()}
        name={field}
        handleOnBlur={handleOnBlur}
        handleOnChange={handleOnChange}
        ref={inputRef}
        type="checkbox"
      />
    );
  }

  BasicCheckbox.propTypes = {
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
  }

  BasicCheckbox.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
    groupApi: {
      onBlur: () => { },
      onChange: () => { },
    },
  }

  return BasicCheckbox;
}

export function asGroupCheckbox(Component, customName = 'GroupCheckbox') {
  return namedField(withGroup(asBasicCheckbox(Component)), customName);
}

export default function asCheckbox(Component, customName = 'Checkbox') {
  return asField(asBasicCheckbox(Component), customName);
}
