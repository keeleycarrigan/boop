import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GroupContext } from '../Context';
import asField from '../HOC/asField';

export class BasicInputGroup extends Component {
    get groupContext() {
        return {
            groupApi: {
                onChange: this.props.onChange,
                onBlur: this.props.onBlur
            },
            fieldApi: this.props.fieldApi,
            fieldState: this.props.fieldState,
            multiselect: this.props.multiselect, // only used for checkboxes
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

const InputGroup = asField(BasicInputGroup);

InputGroup.propTypes = {
    multiselect: PropTypes.bool,
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