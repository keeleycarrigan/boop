 
export function roundNumber (num, decimals = 0) {
    const number = typeof (num) === 'string' ? parseFloat(num) : num;

    // This crazy Number initialization more accurately rounds numbers.
    return Number(`${Math.round(`${isNaN(number) ? 0 : number}e${decimals}`)}e-${decimals}`);
}

export function numberWithCommas (num) {
    const number = typeof (num) === 'string' ? num : num.toString();
    const parts = number.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

export function getCleanNumber (val) {
    const cleaned = typeof (val) === 'string' ? parseFloat(val.replace(/[^\.|\d|-]+/g, ''), 10) : val;

    if (!isNaN(cleaned)) {
        return cleaned;
    }
}

export function getFormattedNumber ({ val, decimals = 0, prefix = '', suffix = '' }) {
    const cleanNumber = getCleanNumber(val);
    const finalVal = cleanNumber ? numberWithCommas(roundNumber(cleanNumber, decimals).toFixed(decimals)) : '';

    return `${prefix}${finalVal}${suffix}`;
}

export function minDigits (digits = 0, min = 2) {
    return (digits).toLocaleString('en-US', { minimumIntegerDigits: min, useGrouping:false });
}

/**
 * Formats time into minutes and seconds
 * @param { number } - pass duration
 * @return - formatted minutes and seconds
 */
export function formatTime (duration = 0) {
    const roughDuration = Math.floor(!isNaN(duration) ? duration : 0);
    const seconds = minDigits(Math.floor(roughDuration % 60), 2);
    const minutes = minDigits(Math.floor(roughDuration / 60), 2);

    return `${minutes}:${seconds}`;
}
