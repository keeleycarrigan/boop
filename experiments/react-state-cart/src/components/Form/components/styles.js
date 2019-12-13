import styled from 'styled-components';

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