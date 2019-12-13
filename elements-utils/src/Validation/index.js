import { getCleanNumber } from 'Numbers';

export function validHasInput (val) {
  return typeof(val) !== 'undefined' && val !== null && val.toString().length > 0;
}

export function validEmail (val = '') {
  return val.match(/^[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+(\.[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/ig);
}

export function validPhone (val = '') {
  return val.replace(/^[0]/g, '').replace(/[\D]/g, '').length >= 10;
}

export function validZipcode (val = '') {
  const zRegEx = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');

  return zRegEx.test(val);
}

export function validEqualTo (compareID) {
  return (val, allVals) => {
    const otherVal = allVals[compareID];

    return validHasInput(otherVal) && otherVal === val;
  }
}

export function validCompare (type = 'min', amount) {
  const comparison = typeof(amount) === 'number' ? amount : getCleanNumber(amount);
  return (val) => {
    const input = typeof(val) === 'number' ? val : getCleanNumber(!validHasInput(val) ? 0 : val);
    let valid = false;

    if (input && comparison) {
      valid = type === 'min' ? (input >= comparison) : (input <= comparison);
    }

    return valid;
  }
}

export function validMin (amount) {
  return validCompare('min', amount);
}

export function validMax (amount) {
  return validCompare('max', amount);
}

export function validInRange (min, max) {
  return (val) => {
    return validMin(min)(val) && validMax(max)(val);
  }
}

export function validNumber (val) {
  return !isNaN(parseFloat(val, 10));
}
