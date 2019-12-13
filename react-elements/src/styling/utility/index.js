import _get from 'lodash/get';
import _find from 'lodash/find';

export const getBreakpoint = (range, breakpointName, breakpoints) => _get(_find(breakpoints, ['name', breakpointName]), range);
export const getBreakpointPxInteger = (range, breakpointName, breakpoints) => parseInt(getBreakpoint(range, breakpointName, breakpoints), 10) * 16; // 16 references default browser size

export const createMediaQueries = (breakpoints) => {
  return breakpoints.reduce((allBPs, bp) => {
    const {
      lower,
      name,
      upper,
    } = bp;
    allBPs[name] = `screen and (min-width: ${lower})`;
    allBPs[`${name}Only`] = `screen and (min-width: ${lower}) and (max-width: ${upper})`;
    allBPs[`${name}Max`] = `screen and (max-width: ${upper})`;

    return allBPs;
  }, {});
};
