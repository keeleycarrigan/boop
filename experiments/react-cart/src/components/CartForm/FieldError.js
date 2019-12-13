import React from 'react';
// import Typography from '@material-ui/core/Typography';
// import red from '@material-ui/core/colors/red';

import { FieldErrorStyle } from './styles';

export default function FieldError({ children, ...props }) {
    return (<FieldErrorStyle variant={'subtitle2'} {...props}>{children}</FieldErrorStyle>);
}