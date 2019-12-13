import { getCleanNumber } from '../../../utilities';

export function hasInput (val) {
    return typeof(val) !== 'undefined' && val !== null && val.toString().length > 0;
}

export function isEmail (val = '') {
    return val.match(/^[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+(\.[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/ig);
}

export function isPhone (val = '') {
    return val.replace(/^[0]/g, '').replace(/[\D]/g, '').length >= 10;
}

export function isZipcode (val = '') {
    const zRegEx = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');

    return zRegEx.test(val);
}

export function isEqualTo (compareID) {
    return (val, allVals) => {
        const otherVal = allVals[compareID];

        return hasInput(otherVal) && otherVal === val;
    }
}

export function compareTo (type = 'min', amount) {
    const comparison = typeof(amount) === 'number' ? amount : getCleanNumber(amount);
    return (val) => {
        const input = typeof(val) === 'number' ? val : getCleanNumber(!hasInput(val) ? 0 : val);
        let valid = false;

        if (input && comparison) {
            valid = type === 'min' ? (input >= comparison) : (input <= comparison);
        }

        return valid;
    }
}

export function isMin (amount) {
    return compareTo('min', amount);
}

export function isMax (amount) {
    return compareTo('max', amount);
}

export function isInRange (min, max) {
    return (val) => {
        return isMin(min)(val) && isMax(max)(val);
    }
}

export function isNumber (val) {
    return !isNaN(parseFloat(val, 10));
}