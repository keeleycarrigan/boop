import React from 'react';
import PropTypes from 'prop-types';

import { withGroup } from '../HOC/with';
import asField from '../HOC/asField';

function getGroupMultiselectVal (currentFormVal = [], isChecked, inputVal) {
  return isChecked ? [...currentFormVal, inputVal] : currentFormVal.filter(val => val !== inputVal);
}

function asBasicCheckbox (Component) {
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
        newVal = isChecked;
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
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.object,
    ]),
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

export function asCheckbox(Component) {
  return asField(asBasicCheckbox(Component));
}

export function asGroupCheckbox (Component) {
  return withGroup(asBasicCheckbox(Component));
}

const DefaultCheckbox = React.forwardRef((props, ref) => {
  const {
    handleOnBlur,
    handleOnChange,
    ...rest
  } = props;

  return (
    <input
      {...rest}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      ref={ref}
    />
  )
});


export const GroupCheckbox  = asGroupCheckbox(DefaultCheckbox);

export default asCheckbox(DefaultCheckbox);