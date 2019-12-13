# momappoki Utilities
***

## Table of Contents

* [Feature Detect](#feature-detect)
* [Local Data](#local-data)
* [Numbers](#number-functions)
* [Dynamic Fields](#dynamic-fields)
* [Target Rates](#target-rates)
---

## Base Utilities
These functions have their documentation in the `base.js` file.
- Moment AP abbreviations
- Log Message
- Convert Key Code
- Get Query Params
- Transform Component Name
- Get Geo Location
- Generate Random Int Inclusive

# Feature Detect

### Features

* Browser Detection
  * Safari
  * Chrome
  * IE
  * Edge
  * Mozilla(Firefox)
  * Webkit
* Interaction Detection
  * Click
  * Touch
  * Pointer

## Usage

### Browser Detection

#### `momappoki.utitlies.browser.<option>`

By default any page including these utilities will be able to set an momappoki name spaced variable `true` or `false` and apply a `<html>` class corresponding to the browser name.

#### Additional Versions

Option | Html Class | Return Value
--- | --- | --- |
`ie` | `ie` | boolean
`edge` | `ie-edge` | boolean
`safari` | `safari` | boolean
`chrome` | `chrome` | boolean
`mozilla` | `mozilla` | boolean


***Example:***

```js
// Set a variable locally based on the return value of the utility
// Will be true or false
const isIe = momappoki.utitlies.browser.ie;
```

### Interaction Detection

#### `momappoki.utilities.isPointerDevice`

This will provide you a boolean value based on whether the device its run on is a Pointer Device.

***Example:***

```js
// Set a variable locally based on the return value of the utility
// Will be true or false
const isIe = momappoki.utilities.isPointerDevice;

```

#### `momappoki.utilities.isTouchDevice`

This will provide you a boolean value based on whether the device its run on is a Touch Device.

***Example:***

```js
// Set a variable locally based on the return value of the utility
// Will be true or false
const isIe = momappoki.utilities.isTouchDevice;
```

---

**[Back to top](#table-of-contents)**

# Local Data

When you need to save data in the browser, `localStorage` and `sessionStorage` can be your friend, but they can be hard to work with and are missing some features cookies offer by default. These utilities making working with them a little less verbose and add the ability for local data to expire.

## Using the Utilities

Initializing an instance isn't required to use the general storage utilities, but you can use `momappoki.utilities.LocalData` if you're going to be manipulating the same piece of data repeatedly. There is a base class that is used to create `momappoki.utilities.localStorage`, `momappoki.utilities.sessionStorage`, and `momappoki.utilities.LocalData`. They all have the same API. The only difference is in how you'd like your data to persist. Checkout the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) if you're not sure or would like to know more.

If you need to do a lot of local data manipulation you there is a `LocalData` class at `momappoki.utilities.LocalData`. You pass in a data object name and storage type and you're set to run the methods on that object without specifying it every time.

## Initialization

**IF** you need/want to use the class to save your data object name you can follow the examples below, but it is not required to create an instance to use the general storage utilities. Pass `'localStorage'` or don't pass a storage type argument if you want to use `localStorage`.

```js
// References a sessionStorage key of 'yourData'.
const yourData = new momappoki.utilities.LocalData('yourData', 'sessionStorage');

// Run methods.
yourData.add({ something: 'some string' });
```

## API

### `momappoki.utilities.[storage type].add`
##### args: (name:`string`, data:`object`)

Use this method to add a new storage object or update a current one.

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1 });

// Sets the localStorage object that would look like this:
{
	allyData: {
		someValue: 1
	}
}

// And returns:
{ someValue: 1 }

```

### `momappoki.utilities.[storage type].update`
##### args: (name:`string`, data:`object`)

Does the same thing as `add`, but the use of this method could make more sense contextually in your code. It actually just uses the `add` method and returns the result. Just syntactic sugar.

```js
momappoki.utilities.localStorage.update('allyData', { someValue: 2 });

// Updates the value specified:
{
	allyData: {
		someValue: 2
	}
}

// And returns:
{ someValue: 2 }
```

### `momappoki.utilities.[storage type].put`
##### args: (name:`string`, data:`object`)

This method overwrites an existing object value with the new one.

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1, otherValue: 3 });

momappoki.utilities.localStorage.put('allyData', { anotherValue: 5 });

// Will overwrite the previously set value:
{
	allyData: {
		anotherValue: 5
	}
}

// And returns:
{ anotherValue: 5 }

```

### `momappoki.utilities.[storage type].remove`
##### args: (name:`string`, key:`string`)

Removes the key specified.

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1, otherValue: 3 });

momappoki.utilities.localStorage.put('allyData', { anotherValue: 5 });

// Will overwrite the previously set value:
{
	allyData: {
		anotherValue: 5
	}
}

// And returns:
{ anotherValue: 5 }
```

### `momappoki.utilities.[storage type].get`
##### args: (name:`string`, key:`string<optional>`)

Gets the object or key value specified.

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1, otherValue: 3 });

momappoki.utilities.localStorage.get('allyData');

// Returns:
{
	someValue: 1,
	otherValue: 3
}

momappoki.utilities.localStorage.get('allyData', 'someValue');

// Returns:
1
```

### `momappoki.utilities.[storage type].setExpire`
##### args: (name:`string`, days:`integer`)

Set an expiry date for an object for any number of days **from** the current day;

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1 });

momappoki.utilities.localStorage.setExpire('allyData', 10);

// Returns:
{
	someValue: 1
	_expires: 'Fri Jun 02 2017 14:36:24 GMT-0400 (EDT)' // 10 days from when you set the expire.
}
```

### `momappoki.utilities.[storage type].isExpired`
##### args: (name:`string`)

Returns a boolean indicating whether an object is expired or not.

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1 });
momappoki.utilities.localStorage.setExpire('allyData', 10);

momappoki.utilities.localStorage.isExpired('allyData');

// Since we don't live in the future, this would return false.
```

### `momappoki.utilities.[storage type].clearExpired`
##### args: (name:`string`)

Looks for an expiry data and clears the object if it's passed due.

```js
momappoki.utilities.localStorage.add('allyData', { someValue: 1 });
momappoki.utilities.localStorage.setExpire('allyData', 10);

momappoki.utilities.localStorage.clearExpired('allyData');

// If the data is expired it returns: {}
// Else it returns the object with its data.
```

---

**[Back to top](#table-of-contents)**

# Number Functions

### `momappoki.utilities.roundNumber`
##### args: (num: `string|number`, decimals: `number`)
##### returns: Number

Accurately returns a number, converted from a string if needed, with the passed in number of decimals.

```js
momappoki.utilities.roundNumber(2.15);
// expected: 2
momappoki.utilities.roundNumber('421.52');
// expected: 422
momappoki.utilities.roundNumber(34.76, 1);
// expected: 34.8
momappoki.utilities.roundNumber('1.652386', 4)
// expected: 1.6524
```

### `momappoki.utilities.numberWithCommas`
##### args: (num: `number`)
##### returns: String

Format the passed in number with commas and return it as a string.

```js
momappoki.utilities.numberWithCommas(61034502);
// expected: '61,034,502'
momappoki.utilities.numberWithCommas(45231.57);
// expected: '45,231.57'
momappoki.utilities.numberWithCommas('1102456.32');
// expected: '1,102,456.32'
```

### `momappoki.utilities.getCleanNumber`
##### args: (val: `string|number`)
##### returns: Number

Formats a string to be a number, or just returns the number.

```js
momappoki.utilities.getCleanNumber(1245);
// expected: 1245
momappoki.utilities.getCleanNumber('16034');
// expected: 16034
momappoki.utilities.getCleanNumber('17,284.6');
// expected: 17284.6
```

### `momappoki.utilities.getFormattedNumber`
##### args: (val: `string|number`, decimals: `number`, prefix: `string`, suffix: `string`)
##### returns: String

Returns a fully formatted string for the number and any desired prefix or suffix.

```js
momappoki.utilities.getFormattedNumber(24000);
// expected: '24,000'
momappoki.utilities.getFormattedNumber('24000',4);
// expected: '2.4000'
momappoki.utilities.getFormattedNumber(24000, 2, '$');
// expected: '$240.00'
momappoki.utilities.getFormattedNumber('24000',2,'$', ' per hour');
// expected: '$240.00 per hour'
```

---

**[Back to top](#table-of-contents)**

# Dynamic Fields
When you need to populate series of fields(not just inputs) with default values, either from a request or another source, the `DynamicFields` class will speed up the process for you.

### HTML Considerations:
Each field should be within a single parent element, and should have a unified data attribute to designate the element to the utility (ex. `data-momappoki-field`).

### Initializing
Constructor Params

- Element: Either a jQuery object or selector for a parent element of the fields.
- Data: The data to be passed into the fields, stored in an object with keys matching a field the value should go into.
- Field Attribute (Optional): Defaults to `'data-momappoki-field'` but is able to be overwritten for a different attribute.

### Methods of Note
The most likely method needed will be the `update` method, which allows a developer to update the data and thus the fields desired.

Signature: `update(data, updateDefault, overwrite);`

#### Params:
- Data: An object of the data to update.
- UpdateDefault (optional): A boolean value to change the default data object. (default: false)
- Overwrite (optional): A boolean value to either overwrite the current data object or extend it. (default: false)

---

**[Back to top](#table-of-contents)**

# Target Rates
Populate html with rates without having to make a call.  A rate call will only be made once if `data-marketing-termid` attribute is in the DOM initially or inject via Test & Target. If the term is tiered, an additional attribute, `data-marketing-tier` will be required or the rate won't be returned. The higher value in the tier attribute will return the higher apy. String value is returned.

```
// Example markup
<span data-marketing-termid="IRARYR-24"></span>
<p data-marketing-termid="HYCD-3" data-marketing-tier="2" >
```

## Rates

* DDA termids
  * DDA-0

Tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or data-marketing-tier="1")

* HYCD termids
  * HYCD-3
  * HYCD-6
  * HYCD-9
  * HYCD-12
  * HYCD-18
  * HYCD-36
  * HYCD-60

All HYCD terms are tiered products so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* IRAHY termids
  * IRAHY-3
  * IRAHY-6
  * IRAHY-9
  * IRAHY-12
  * IRAHY-18
  * IRAHY-36
  * IRAHY-60

All IRAHY terms are tiered products so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* IRAOSA termids
  * IRAOSA-0

Tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* IRARYR termids
  * IRARYR-24
  * IRARYR-48

IRARYR 48 is a tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* MMDA termids
  * MMDA-0

Tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* NCD termids
  * NCD-11

Tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* OSAV termids
  * OSAV-0

Tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

* RYRCD termids
  * RYRCD-24
  * RYRCD-48

RYRCD-48 is a tiered product so it requires additional data attribute (e.g. data-marketing-tier="0" or "1", "2")

## Requirements
To utilize target rates on a page add `/resources/storefront/global/services/bank-rates.js` to body asset override.

---

**[Back to top](#table-of-contents)**
