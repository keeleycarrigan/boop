'use strict';

((momappoki, $, _, window) => {
  momappoki.utilities = momappoki.utilities || {};

  // jQuery Pseudo Selector Extensions
  // Convenience function to determine if the element is focusable
  $.extend($.expr[':'], {
    focusable (el) {
      const $el = $(el);
      return $el.is('a, [tabindex], :input, button, audio[controls], video[controls]') && $el.is(':visible') && !$el.is('[disabled]');
    }
  });

  /**
   * This util sets it up so the date can be formatted to show the new
   * AP abbreviated version (see http://ux.int.momappoki.com/content/dates/).
   * Instead of moment().format('MMM. D, YYYY') use
   * moment().locale(en-APsytle').format('MMM D, YYYY').
   *
   * This abbreviates all months except March, April, May, June and July
   */
  // ---------------------------------------------------------------------------
  momappoki.utilities.momentAPabbreviations = () => {
    if (moment) {
      moment.locale('en-APstyle', {
        monthsShort: [
          'Jan.', 'Feb.', 'March', 'April', 'May', 'June',
          'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
        ]
      });
    }
  };

  /**
   * This util logs out messages in the console if there is a debug paramater
   * in the url (?debug). The filename should be included in your arguments in
   * some way to help with debugging
   *
   * e.g. If you have a formatted string, you should have...
   * momappoki.utilities.logMessage(
   *   'log', 'core.bootstrap.js: %cThis is a log', 'color:green;'
   * );
   *
   * @param  {String} [type] The type of log ('log', 'error', 'warn')
   *                         If undefined, defaults to console.log
   */
  // ---------------------------------------------------------------------------

  momappoki.utilities.logMessage = function (type) {
    const debugMode = window.location.search.indexOf('debug') > -1;
    if (!debugMode || !window.console) return undefined;

    /* eslint-disable no-console */
    if (typeof type !== 'string' || !console[type]) {
      return console.log.apply(console, arguments);
    }
    return console[type].apply(
      console, Array.prototype.slice.call(arguments, 1)
    );
    /* eslint-enable no-console */
  };

  /**
   * Convenience function to convert an event object into keyCode information
   *
   * @param {Object} event The event object containing the keyCode information
   * @returns {Object}
   */
  // ---------------------------------------------------------------------------
  momappoki.utilities.convertKeyCode = (e) => {
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

  /**
   * Given a string `name` and an optional URL, looks in the URL's query
   * params for a value of the given name and returns it, or undefined.
   *
   * @param {String} name The key to look for in the query params
   * @param {String} url The URL to search in, or the current page URL
   * @returns {Object|String|Undefined} The string interpretation of the `name`
   * key's value, or undefined if not found
   */
  momappoki.utilities.getQueryParams = (name, url = window.location.search) => {
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
      found = !_.isEmpty(params) && params;

      if (name && params) {
        found = params[name];
      }
    }

    return found;
  };

  function transformComponentName (compName) {
    const transforms = {
      street_number: 'streeNumber',
      route: 'street',
      neighborhood: 'neighborhood',
      locality: 'city',
      administrative_area_level_2: 'county',
      administrative_area_level_1: 'state',
      country: 'country',
      postal_code: 'zipcode'
    };

    return transforms[compName];
  }

  momappoki.utilities.getGeoLocation = (opts = {}) => {
    const def = $.Deferred();
    const defaultError = { error: true, msg: 'Geolocation unavailable.' };
    const geoOpts = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 3600000
    };

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (pos) => {
          $.ajax({
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}`,
            success (data) {
              const parsed = data.results[0].address_components.reduce((obj, component) => {
                const {
                  long_name: longName,
                  short_name: shortName
                } = component;

                const locationKey = transformComponentName(component.types[0]);

                if (locationKey) {
                  obj[locationKey] = { longName, shortName };
                }

                return obj;
              }, {});

              def.resolve(parsed);
            },
            error () {
              def.resolve(defaultError);
            }
          });
        },
        () => def.resolve(defaultError),
        $.extend({}, geoOpts, opts)
      );
    } else {
      def.resolve(defaultError);
    }

    return def.promise();
  };

  /**
   * Generate's a random integer between a min (inclusive) and a max
   * (inclusive).
   *
   * @param  {Integer} min The minimum possible random integer to generate
   * @param  {Integer} max The maximum possible random integer to generate
   * @return {Integer}     A random integer between min and max
   */
  // ---------------------------------------------------------------------------
  momappoki.utilities.generateRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  window.momappoki = momappoki;
})(window.momappoki || {}, $, _, window);
