import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import asField from '../../components/Form/HOC/asField';

import FieldError from './FieldError';
import {
    FormField,
} from './styles';


class TextInput extends PureComponent {
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

    renderError(errors) {
        if (errors) {
            return errors.map((error, idx) => <FieldError key={`error-${idx}`}>{error}</FieldError>);
        }
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

        return (
            <FormField>
                <TextField
                    {...rest}
                    error={errors && errors.length > 0}
                    inputRef={forwardedRef}
                    name={field}
                    onBlur={this.handleOnBlur}
                    onChange={this.handleOnChange}
                    value={typeof (value) === 'undefined' ? '' : value}
                />
                {this.renderError(errors)}
            </FormField>
        );
    }

};

const CartTextInput = asField(TextInput, 'Text');

CartTextInput.propTypes = {
    validate: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.object,
    ]),
}

CartTextInput.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
}

export default CartTextInput;
