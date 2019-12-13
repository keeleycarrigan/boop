import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { asRadio } from '../../components/Form/components/Radio';


function BasicCartRadio({ checked, handleOnChange, handleOnBlur, id, label, ...props }) {
    return (
        <FormControlLabel
            control={<Radio id={id} checked={checked} color={'primary'} />}
            htmlFor={id}
            label={label}
            labelPlacement={'start'}
            onBlur={handleOnBlur}
            onChange={handleOnChange}
            {...props}
        />
    );
};

export default asRadio(BasicCartRadio);