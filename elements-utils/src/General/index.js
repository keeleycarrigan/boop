import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import _isPlainObject from 'lodash/isPlainObject';
import _reduce from 'lodash/reduce';

export function deepRemoveEmpty(obj) {
  return _reduce(obj, (accum, val, key) => {
    if (_isPlainObject(val) || _isArray(val)) {
      const items = deepRemoveEmpty(val);
      if (!_isEmpty(items)) {
        if (_isPlainObject(accum)) {
          accum[key] = items;
        } else {
          accum = [...accum, items];
        }
      }
    } else if (typeof (val) !== 'undefined') {
      if (_isPlainObject(accum)) {
        accum[key] = val;
      } else {
        accum = [...accum, val];
      }
    }

    return accum;
  }, _isPlainObject(obj) ? {} : []);
}

export function convertKeyCode(e) {
  const keyCode = e.keyCode || e.which;
  if (!keyCode) return {};

  const isLeftDir = keyCode === 37;
  const isUpDir = keyCode === 38;
  const isRightDir = keyCode === 39;
  const isDownDir = keyCode === 40;
  const isPageUp = keyCode === 33;
  const isPageDown = keyCode === 34;
  const isDown = isRightDir || isDownDir || isPageDown;
  const isUp = isLeftDir || isUpDir || isPageUp;

  return {
    isLeftDir,
    isUpDir,
    isRightDir,
    isDownDir,
    isPageUp,
    isPageDown,
    isDown,
    isUp,
    isDir: isDown || isUp,
    isEnd: keyCode === 35,
    isHome: keyCode === 36,
    isEnter: keyCode === 13,
    isTab: keyCode === 9,
    isEsc: keyCode === 27,
    isShift: e.shiftKey,
    isSpace: keyCode === 32,
    char: String.fromCharCode(keyCode),
    keyCode
  };
};

export function getQueryParams(key, url = window.location.search) {
  const parseURL = url.match(/\?.+/);
  let found;

  if (parseURL && parseURL.length) {
    const parts = parseURL[0].split(/&|\?/g);
    const params = parts.reduce((obj, part) => {
      const keyVal = part.split('=');

      if (keyVal.length && keyVal[0].trim() !== '') {
        obj[keyVal[0]] = keyVal[1] || true;
      }

      return obj;
    }, {});
    found = !_isEmpty(params) && params;

    if (key && params) {
      found = params[key];
    }
  }

  return found;
};

/**
 * This util logs out messages in the console if there is a debug paramater
 * in the url (?debugLogging). The filename should be included in your arguments in
 * some way to help with debugging
 *
 * e.g. If you have a formatted string, you should have...
 * debugLog(
 *   'log', 'nameOfFile.js: %cThis is a log', 'color:green;'
 * );
 *
 * @param  {String} [type] The type of log ('log', 'error', 'warn')
 *                         If undefined, defaults to console.log
 */
// ---------------------------------------------------------------------------

export function debugLog(type = 'log', ...args) {
  const debugMode = getQueryParams('debugLogging');

  if (debugMode && window.console) {
    /* eslint-disable no-console */
    if (typeof type !== 'string' || !console[type]) {
      return console.log.apply(console, arguments);
    } else {
      return window.console[type].apply(window.console, args);
    }
    /* eslint-enable no-console */
  }
};
