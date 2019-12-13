import _upperFirst from 'lodash/upperFirst';

import createBreakpointModifiers from 'style-utils/modifiers';

const createSpacingProps = () => {
  const core = ['margin', 'padding'];
  const dimensions = ['top', 'right', 'bottom', 'left', 'x', 'y', 'all'];
  return core.reduce((spacing, coreProp) => {
    const allDimensions = dimensions.map((dimension) => {
      const dimensionName = dimension === 'all' ? '' : _upperFirst(dimension);
      let cssProp = '';

      switch (dimension) {
        case 'x':
          cssProp = [`${coreProp}-left`, `${coreProp}-right`];
          break;
        case 'y':
          cssProp = [`${coreProp}-top`, `${coreProp}-bottom`];
          break;
        case 'all':
          cssProp = coreProp;
          break;
        default:
          cssProp = `${coreProp}-${dimension}`;
      }

      return {
        cssProp,
        propName: `${coreProp}${dimensionName}`,
      }
    });
    spacing = [...spacing, ...allDimensions];
    return spacing;
  }, []);
};

const spacing = createBreakpointModifiers(createSpacingProps());

export default spacing;
