import _omit from 'lodash/omit';

const Listener = (() => {
  let calls = {};
  let events = {};

  return {
    on(key, callback = () => {}, useLastCall) {
    if (!events[key]) {
      events[key] = [];
    }

    events[key] = [...events[key], callback];

    if (useLastCall && typeof calls[key] !== 'undefined') {
      callback(calls[key]);
    }
  },
  clear(key, callback = null) {
    // If a callback is passed and the events array has additional callbacks,
    // then just remove the argument callback
    if (callback !== null && events[key].length > 1) {
      // Filter out the matching callback
      events[key] = events[key].filter(cb => cb !== callback);
    } else {
      // remove the entire event array if there's no callback argument or if
      // that callback is the only item in the array
      events = _omit(events, key);
    }
  },
  trigger(key, data = null) {
      calls[key] = data;

      if (events[key]) {
        events[key].forEach(callback => callback(data));
      }
    }
  }
})();

export default Listener;
