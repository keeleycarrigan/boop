# General Utilities

General use javascript utilities.



## Functions


### `deepRemoveEmpty`
##### args: (obj:`object`)

Cleans `undefined` or empty values from an object recursively. Useful when an objects keys are being set and unset regularly while avoiding object mutation.

### `convertKeyCode`
##### args: (e:`event object`)

Returns useful information about the key a user has pressed. Usually used in the creation of a11y functionality. Some directional data is grouped because the same action is usually necessary when any of a group of buttons are pressed. See `isDown` or `isUp`.

Info returned:

```js
{
    isLeftDir,
    isUpDir,
    isRightDir,
    isDownDir,
    isPageUp,
    isPageDown,
    isDown, // right arrow, down arrow, and page down button
    isUp, // left arrow, up arrow, and page up button
    isDir, // is any direction
    isEnd,
    isHome,
    isEnter,
    isTab,
    isEsc,
    isShift,
    isSpace,
    char,
    keyCode
}
```

### `getQueryParams`
##### args: (key:`string<optional>`, url: `string<optional>`)
##### defaults: (url: `window.location.search`)

Turns a url's query parameters into an object or returns the value of a query parameter if it exists. If no arguments are passed all parameters are returned. If a `key` is passed the value of that `key` will be returned if it exists. Otherwise `undefined` is returned.

### `debugLog`
##### args: (type:`string<optional>`, ...args: `string<optional>`)

Useful for leaving logs in code used for debugging but not when the `debugLogging` query paramter is not in the url. The default type of console log is `log` but `error` and `warn` can also be passed. If `console.log` is preferred just pass valid string arguments, comma separated to the function. These will be applied to the `console` function of your choice. [See here](https://coderwall.com/p/m2trga/enhance-your-js-console-logging-messages) how you can format your messages. Good practice for messaging would be prefixing your message with the file and method the message comes from.

```js
debugLog('[fileName].[method]:%cData found', 'color:green', data);
```