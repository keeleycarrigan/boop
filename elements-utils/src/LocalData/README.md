# Local Data

When you need to save data in the browser, `localStorage` and `sessionStorage` can be your friend, but they can be hard to work with and are missing some features cookies offer by default. This class makes working with them a little less verbose and adds the ability for local data to expire.

## Usage

After importing the module, initialize an instance using the storage key that should be manipulated and the type of storage you either want to create or the type of an existing object.

```js
import LocalData from '@momappoki/elements-utils/LocalData';

const myLocalStorageData = new LocalData('mainDataKey');

const mySessionStorageData = new LocalData('otherDataKey', 'sessionStorage');
```

This will create an instanced object that will only operate on the main storage key and type of storage you initialize with. The idea is that you would organize your data into related chunks and not store every new piece of data on the main `localStorage` object.

`localStorage` and `sessionStorage` have the same API. The only difference is in how you'd like your data to persist. Checkout the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) if you're not sure or would like to know more.



## API

All included methods assume that the main storage key's value is JSON. So all stored data should be passed as an object.

```js
// BAD
myLocalStorageData.add('just some string');

// GOOD
myLocalStorageData.add({ yourString: 'just some string' });

```

### `add`
##### args: (data:`object`)

Use this method to add a new storage object or update a current one.

```js
myLocalStorageData.add({ someValue: 1 });

// Sets the localStorage object that would look like this:
{
	yourData: {
		someValue: 1
	}
}

// And returns:
{ someValue: 1 }

```

### `update`
##### args: (data:`object`)

Does the same thing as `add`, but the use of this method could make more sense contextually in your code. It actually just uses the `add` method and returns the result. Just syntactic sugar.

```js
myLocalStorageData.update({ someValue: 2 });

// Updates the value specified:
{
	yourData: {
		someValue: 2
	}
}

// And returns:
{ someValue: 2 }
```

### `put`
##### args: (data:`object`, key:`string<optional>`)

This method overwrites an existing object value with the new one. Necessary if your object has arrays or nested objects and you are removing data because the `merge` that `add` or `update` uses will not remove them. If you pass an existing `key` as the second argument only that key's value will be replaced. Otherwise, all data in the main object will be replaced.

```js
myLocalStorageData.add({ someValue: 1, otherValue: 3 });

myLocalStorageData.put({ anotherValue: 5 });

// Will overwrite the previously set value:
{
	yourData: {
		anotherValue: 5
	}
}

// And returns:
{ anotherValue: 5 }

```

### `remove`
##### args: (key:`string`)

Removes the key specified.

```js
myLocalStorageData.add({ someValue: 1, otherValue: 3 });

// Before removing 'otherValue':
{
	yourData: {
		someValue: 1,
		otherValue: 3
	}
}

myLocalStorageData.remove('otherValue');

// After removing 'otherValue':
{
	yourData: {
		someValue: 1
	}
}

// And returns:
{ someValue: 1 }
```

### `get`
##### args: (key:`string<optional>`)

Gets the object or key value specified.

```js
myLocalStorageData.add({ someValue: 1, otherValue: 3 });

myLocalStorageData.get();

// Returns:
{
	someValue: 1,
	otherValue: 3
}

myLocalStorageData.get('someValue');

// Returns:
1
```

### `setExpire`
##### args: (days:`integer`, currentDate:`valid timestamp, UNIX date, valid Date string<optional>`)
##### defaults: (days: `0`, currentDate: `Date.now()`)

Set an expiry date for an object for any number of days **from** the current day. Since the default for `currentDate` is just using JS `Date` and that is based on the user's machine time it's recommended that the current date be retrieved from the server.

```js
myLocalStorageData.add({ someValue: 1 });

myLocalStorageData.setExpire(10);

// Returns:
{
	someValue: 1
	_expires: 'Fri Jun 02 2017 14:36:24 GMT-0400 (EDT)' // 10 days from when you set the expire.
}
```

### `isExpired`
##### args: (currentDate:`valid timestamp, UNIX date, valid Date string<optional>`)
##### defaults: (currentDate: `Date.now()`)

Returns a boolean indicating whether an object is expired or not. Since the default for `currentDate` is just using JS `Date` and that is based on the user's machine time it's recommended that the current date be retrieved from the server.

```js
myLocalStorageData.add({ someValue: 1 });
myLocalStorageData.setExpire(10);

myLocalStorageData.isExpired();

```
Since we don't live in the future, this would return `false`.

### `clearExpired`
##### args: (currentDate:`valid timestamp, UNIX date, valid Date string<optional>`)
##### defaults: (currentDate: `Date.now()`)

Checks for an expiration date and then clears the object if it's expired.  Since the default for `currentDate` is just using JS `Date` and that is based on the user's machine time it's recommended that the current date be retrieved from the server.

```js
myLocalStorageData.add({ someValue: 1 });
myLocalStorageData.setExpire(10);

myLocalStorageData.clearExpired();

```
If the data is expired it returns `{}`, else it returns the object with its data.
  
  
