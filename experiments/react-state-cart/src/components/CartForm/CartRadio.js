import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { asRadio } from '@momappoki/elements/Form/components/Radio';


const BasicCartRadio = React.forwardRef((props, ref) => {
    const {
        checked,
        inputRef,
        handleOnBlur,
        handleOnChange,
        id,
        label,
        ...rest
    } = props;

    return (
        <FormControlLabel
            control={(
                <Radio
                    checked={checked}
                    color={'primary'}
                    id={id}
                    inputRef={ref}
                    onBlur={handleOnBlur}
                    onChange={handleOnChange}
                 />
            )}
            htmlFor={id}
            label={label}
            labelPlacement={'start'}
            {...rest}
        />
    );
});

export default asRadio(BasicCartRadio);
