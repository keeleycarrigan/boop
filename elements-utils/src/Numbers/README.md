# Number Utilities

Useful, composable functions for dealing with numbers.



## Functions


### `roundNumber`
##### args: (num:`number/string`, decimals: `number<optional>`)
##### defaults: (decimals: `0`)

More accurately rounds numbers to the decimal places provided as apposed `toFixed` or `Math.round` by itself.


### `numberWithCommas`
##### args: (num:`number/string`)

Returns a number with commas placed in the appropriate positions. Works on numbers with decimal places.

### `getCleanNumber`
##### args: (val:`number/string`)

Cleans non-number characters from the value provided. Will return `undefined` if the cleaned and parsed value is `NaN`.

### `getFormattedNumber`
##### args: (object: `{ val, decimals, prefix, suffix }`)
##### defaults: (object: `{ decimals = 0, prefix = '', suffix = '' }`)

Cleans and formats input with commas, decimal places, a prefix, and or a suffix. Useful when working with masked input fields or having to display a formatted version of a calculation, etc. For example:

```js
// User input is '$500,000.75' and a calculation must be done and displayed in the same format.

const cleanedInput = getCleanNumber(userInput); // 500000.75
const calculation = cleanedInput / 4; // 125000.1875

return getFormattedNumber({ val: calculation, decimals: 2, prefix: '$' }); // $125,000.19

```
Using this function in an input mask makes it a little easier to show characters at the beginning or end of the user input consistently like `40%`. If the function is configured with a suffix of `%` the number will always be displayed ending with a percent sign.

### `minDigits`
##### args: (digits:`number`, min: `number<optional>`)
##### defaults: (digits:`0`, min: `2`)

Returns a string with the minimum number of digits specified. For example, if you want a display to **always** show 3 digits no matter what you could do the following.

```js
const threeDigitNumber = minDigits(3, 3); // '003'
```

### `formatTime`
##### args: (duration:`number`)
##### defaults: (duration:`0`)

Given an amount of seconds the time will be returned with `[minutes]:[seconds]`.
