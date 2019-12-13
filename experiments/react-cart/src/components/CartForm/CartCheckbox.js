import React, { PureComponent } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { asCheckbox } from '../../components/Form/components/Checkbox';

const BasicCartCheckbox = React.forwardRef((props, ref) => {
        const {
            checked,
            forwardedRef,
            handleOnBlur,
            handleOnChange,
            id,
            label,
            ...rest,
        } = props;
        return (
            <FormControlLabel
                control={<Checkbox id={id} inputRef={ref} checked={checked} color={'primary'} />}
                htmlFor={id}
                label={label}
                labelPlacement={'start'}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                {...rest}
            />
        );
    });

export default asCheckbox(BasicCartCheckbox);