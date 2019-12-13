import React from 'react';

import {
    withFormConnection,
} from '@momappoki/elements/Form/HOC/with';

import { FieldErrorStyle } from './styles';

export default function FieldError({ children, ...props }) {
    return (<FieldErrorStyle variant={'subtitle2'} {...props}>{children}</FieldErrorStyle>);
}

export function FieldErrorList({ errors, ...props }) {
    if (errors) {
        return errors.map((error, idx) => <FieldError key={`error-${idx}`} {...props}>{error}</FieldError>);
    }

    return null;
}

function DefaultFormErrors({ formApi, controller, ...props }) {
    return <FieldErrorList errors={formApi.getErrors()} {...props} />
}

export const MainFormErrors = withFormConnection(DefaultFormErrors);
