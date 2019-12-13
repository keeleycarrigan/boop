import _ from 'lodash';

export function convertKeyCode (e) {
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
    const isEnd = keyCode === 35;
    const isHome = keyCode === 36;
    const isEnter = keyCode === 13;
    const isTab = keyCode === 9;
    const isEsc = keyCode === 27;
    const isShift = e.shiftKey;
    const isSpace = keyCode === 32;
    const char = String.fromCharCode(keyCode);

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
      isEnd,
      isHome,
      isEnter,
      isTab,
      isEsc,
      isShift,
      isSpace,
      char,
      keyCode
    };
  };

  export function getQueryParams (name, url = window.location.search) {
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
      found = !isEmpty(params) && params;

      if (name && params) {
        found = params[name];
      }
    }

    return found;
  };