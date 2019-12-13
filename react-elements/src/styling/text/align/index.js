import createBreakpointModifiers from 'style-utils/modifiers';

const textAlignProps = [
  {
    cssProp: 'text-align',
    propName: 'textAlign',
  },
];

export const textAlign = createBreakpointModifiers(textAlignProps);

export default textAlign;
