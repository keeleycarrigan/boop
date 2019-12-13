import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

import { asSelect } from '@momappoki/elements/Form/components/Select';

import { FieldErrorList } from './FieldError';
import {
    FormField,
} from './styles';

const styles = theme => ({
    formControl: {
        display: 'flex'
    },
});

const BasicSelect = React.forwardRef((props, ref) => {
    const {
        children,
        classes,
        errors,
        field,
        handleOnBlur,
        handleOnChange,
        hasError,
        id,
        label,
        touched,
        ...rest
    } = props;

    return (
        <FormField>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <NativeSelect
                    {...rest}
                    id={id}
                    error={hasError}
                    name={field}
                    onBlur={handleOnBlur}
                    onChange={handleOnChange}
                    inputRef={ref}
                >
                    {children}
                </NativeSelect>
            </FormControl>
            <FieldErrorList errors={errors} />
        </FormField>
    );
});

const CartSelect = withStyles(styles)(asSelect(BasicSelect));

export default CartSelect;
