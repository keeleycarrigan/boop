import styled from 'styled-components';

import { themeRems } from 'style-utils/units';
import { FormLabelText } from 'Form/components/Form/styles';

export const BaseInputControlWrapper = styled.label`
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const BaseInputControlInput = styled.input`
  background: none;
  border: none;
  height: ${themeRems(24)};
  left: 0;
  margin: 0;
  position: absolute;
  top: 0;
  width: ${themeRems(24)};
  -webkit-appearance: none;
`;

export const BaseInputControlLabel = styled.span`
  ${FormLabelText}
  flex: 1 0 0;
`;

export const BaseInputControlIcon = styled.svg`
  height: ${themeRems(24)};
  margin-right: ${themeRems(10)};
  width: ${themeRems(24)};
  display: block;
`;
