import createBreakpointModifiers from 'style-utils/modifiers';

const textSizeProps = [
  {
    cssProp: 'font-size',
    propName: 'textSize',
  },
];

export const textSize = createBreakpointModifiers(textSizeProps);

export default textSize;
