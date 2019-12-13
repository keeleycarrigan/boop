import React from 'react';

import TextField from '@material-ui/core/TextField';

import { asTextField } from '@momappoki/elements/Form/components/TextInput';

import { FieldErrorList } from './FieldError';
import {
    FormField,
} from './styles';

const TextInput = React.forwardRef((props, ref) => {
    const {
        errors,
        field,
        hasError,
        handleOnChange,
        handleOnBlur,
        touched,
        ...rest
    } = props;

    return (
        <FormField>
            <TextField
                {...rest}
                error={hasError}
                inputRef={ref}
                name={field}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
            />
            <FieldErrorList errors={errors} />
        </FormField>
    );
});

export default asTextField(TextInput);
