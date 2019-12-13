import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import asField from '../HOC/asField';


export class BasicText extends PureComponent {
    handleOnChange = (e) => {
        const {
            fieldApi,
            onChange,
        } = this.props;

        fieldApi.setValue(e.target.value);
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
        const { fieldApi, fieldState, ...props } = this.props;
        const {
            errors,
            touched,
            value,
        } = fieldState;
        const {
            errorLimit,
            field,
            forwardedRef,
            initialValue,
            maskOnChange,
            onBlur,
            onChange,
            ...rest
        } = props;
        const style = errors ? { border: '1px solid red' } : {};

        return (
            <input
            {...rest}
            style={style}
            name={field}
            ref={forwardedRef}
            value={typeof (value) === 'undefined' ? '' : value}
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            />
        );
    }

};

const Text = asField(BasicText, 'Text');

Text.propTypes = {
  validate: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
}

Text.defaultProps = {
    onBlur: () => {},
    onChange: () => {},
}

export default Text;
