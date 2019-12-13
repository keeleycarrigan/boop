import styled from 'styled-components';

import spacing from 'layout/spacing';
import display from 'layout/display';
import align from 'layout/align';
import textAlign from 'style/text/align';
import textSize from 'style/text/size';
import colors from 'style/color';

const Box = styled.div`
  box-sizing: border-box;

  ${display}
  ${align}
  ${spacing}
  ${colors}
  ${textAlign}
  ${textSize}
`;

export default Box;
