import _debounce from 'lodash/debounce';
import _omit from 'lodash/omit';

import Listener from 'Listener';
import { debugLog } from 'General';


const GlobalListeners = (() => {
  // Assign an object of event name -> handler functions to be looped below
  const handlerMappings = {
    resize: _debounce(event => Listener.trigger('GLOBAL_RESIZE', event), 100),
    scroll: event => Listener.trigger('GLOBAL_SCROLL', event),

    mousedown: event => Listener.trigger('GLOBAL_MOUSE_DOWN', event),
    touchstart: event => Listener.trigger('GLOBAL_TOUCH_START', event),

    mousemove: event => Listener.trigger('GLOBAL_MOUSE_MOVE', event),
    touchmove: event => Listener.trigger('GLOBAL_TOUCH_MOVE', event),

    mouseup: event => Listener.trigger('GLOBAL_MOUSE_UP', event),
    touchend: event => Listener.trigger('GLOBAL_TOUCH_END', event),
  };
  // Declare an empty storage object for already added listeners
  let addedListeners = {};
  const listenerActions = {
    add(eventName) {
      // If an event name argument is passed, then just add and return the single
      // event listener, otherwise return all the event listeners declared above
      if (typeof (eventName) === 'string') {
        if (addedListeners[eventName]) {

          debugLog('warn', 'GlobalListeners.add:%cMultiple global event listeners are being declared. This is unnecessary.', 'font-weight:bold');
        } else {
          // Store the listener so it can be checked above as to whether or not it
          // was created yet
          addedListeners[eventName] = true;

          // Add the event listener and just return it as there's no return value
          // required, so sending the listeners default return value of `undefined`
          // seems appropriate
          window.addEventListener(eventName, handlerMappings[eventName]);
        }
      } else {
        all('add')
      }
    },
    remove(eventName) {
      // If an event name argument is passed, then just add and return the single
      // event listener, otherwise return all the event listeners declared above
      if (typeof (eventName) === 'string') {
        if (addedListeners[eventName]) {
          // Remove the stored boolean for the listener since it's about to be removed
          addedListeners = _omit(addedListeners, eventName);

          // If handler was made with a _debounce, cancel the debounce.
          handlerMappings[eventName].cancel && handlerMappings[eventName].cancel();

          window.removeEventListener(eventName, handlerMappings[eventName]);
        } else {
          debugLog('warn', `GlobalListeners.remove:%cThe "${eventName}" event has already been removed. No need to remove it again.`, 'font-weight:bold');
        }
      } else {
        all('remove');
      }
    }
  }
  function all(action) {
    Object.keys(handlerMappings).forEach(eventName => listenerActions[action](eventName));
  }

  return {
    add: listenerActions.add,
    all,
    remove: listenerActions.remove,
  }
})();

export default GlobalListeners;
