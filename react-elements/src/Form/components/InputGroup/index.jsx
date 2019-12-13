import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GroupContext } from 'Form/Context';
import asField from 'Form/HOC/asField';

class BasicInputGroup extends Component {
  get groupContext() {
    const {
      field,
      fieldApi,
      fieldState,
      multiselect,
      name,
      onBlur,
      onChange,
    } = this.props;
    return {
      groupApi: {
        field,
        name: name || field,
        onBlur,
        onChange,
      },
      fieldApi,
      fieldState,
      multiselect, // only used for checkboxes
    };
  }

  render() {
    return (
      <GroupContext.Provider value={this.groupContext}>
        {this.props.children}
      </GroupContext.Provider>
    );
  }
}

const InputGroup = asField(BasicInputGroup, 'InputGroup');

InputGroup.propTypes = {
  field: PropTypes.string.isRequired,
  initialValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  multiselect: PropTypes.bool,
  name: PropTypes.string,
  notify: PropTypes.arrayOf(PropTypes.string),
  validate: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
}

InputGroup.defaultProps = {
  multiselect: true,
  onBlur: () => { },
  onChange: () => { },
}

export default InputGroup;
