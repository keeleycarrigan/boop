import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';

export const FormField = styled.fieldset`
    border: none;
    margin: 0;
    padding: 0 0 20px;
`;

export const FieldErrorStyle = styled(Typography)`
    && {
        color: ${red[500]};
    }
`;