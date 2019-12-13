import React, { PureComponent } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { asCheckbox } from '@momappoki/elements/Form/components/Checkbox';


const BasicCartCheckbox = React.forwardRef((props, ref) => {
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
                    <Checkbox
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

export default asCheckbox(BasicCartCheckbox);
