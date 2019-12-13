import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import RootRef from '@material-ui/core/RootRef';

import asField from '../../components/Form/HOC/asField';

import FieldError from './FieldError';
import {
    FormField,
} from './styles';

const styles = theme => ({
    formControl: {
        display: 'flex'
    },
});

class BasicSelect extends PureComponent {
    constructor(props) {
        super(props);

        this.selectRef = props.forwardedRef || React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.forwardedRef !== prevProps.forwardedRef) {
            this.selectRef = this.props.forwardedRef;
        }
    }

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
            children,
            classes,
            field,
            forwardedRef,
            id,
            initialValue,
            label,
            multiple,
            onBlur,
            onChange,
            ...rest
        } = props;

        return (
            <FormField>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor={id}>{label}</InputLabel>
                    <RootRef rootRef={this.selectRef}>
                        <NativeSelect
                            {...rest}
                            id={id}
                            error={errors && errors.length > 0}
                            multiple={multiple}
                            name={field}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                            value={value || (multiple ? [] : '')}
                        >
                            {children}
                        </NativeSelect>
                    </RootRef>
                    
                </FormControl>
                {this.renderError(errors)}
            </FormField>
        );
    }
}

const CartSelect = withStyles(styles)(asField(BasicSelect));

CartSelect.propTypes = {
    validate: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.object,
    ]),
}

CartSelect.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
}

export default CartSelect;