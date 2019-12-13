import styled, { css } from 'styled-components';

import { themeRems } from 'style-utils/units';
import { grayScale } from 'style/color/default';

export const FormA11yErrorContainer = styled.div`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

export const FormA11yErrorButton = styled.button`
  display: block;

  &:focus {
    outline: none;
  }
`;

export const FormFieldSet = styled.fieldset`
  border: none;
`;

export const FormLabelText = css`
  color: ${grayScale.gray5};
  font-family: 'Helvetica', 'Arial', 'sans-serif';
  font-size: ${themeRems(14)};
  font-weight: bold;
  line-height: ${themeRems(24)};
`;

export const FormLabel = styled.label`
  ${FormLabelText}
  display: block;
`;

const FormElement = styled.form`
  width: 100%;
`;

export default FormElement;
