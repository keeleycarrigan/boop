import {
  isArray,
  get,
  filter,
  merge,
  omit,
  isPlainObject,
  reduce,
  isEmpty,
} from 'lodash';

import { debugLog } from './index';

class BaseLocalData {
  constructor (type = 'localStorage') {
    this.storageType = type;
  }

  dataParse (dataName) {
    return JSON.parse(window[this.storageType].getItem(dataName));
  }

  find (data, match) {
    const localData = typeof (data) === 'string' ? this.get(data) : data;
    const filtered = localData ? filter(localData, match) : [];
    let found = null;

    if (filtered.length) {
      if (filtered.length > 1) {
        found = filtered;
      } else {
        found = filtered[0];
      }
    } else if (localData && typeof (match) === 'string' && localData[match]) {
      found = localData[match];
    }

    if (found) {
      debugLog('local-data.js:%cFind Item found in Storage', 'color:green', match);
    } else {
      debugLog('local-data.js:%cFind Item not found in Storage', 'color:red', match);
    }
    return found;
  }

  get (dataName, key) {
    const data = this.dataParse(dataName);
    let retrievedData = null;

    if (data) {
      retrievedData = key ? this.find(data, key) : data;
    }

    if (retrievedData) {
      debugLog(`local-data.js:%cData found in "${dataName}"`, 'color:green', retrievedData);
    } else {
      debugLog(`local-data.js:%cStorage key "${dataName}" not found because key isn\'t a string or does not exist.`, 'color:red');
    }

    return retrievedData;
  }

  put (dataName, data = {}) {
    if (typeof (dataName) === 'string') {
      window[this.storageType].setItem(dataName, JSON.stringify(data));
      debugLog(`local-data.js:%cData overwritten in "${dataName}"`, 'color:green', data);
    } else {
      debugLog(`local-data.js:%cData not added to "${dataName}" because storage key isn\'t a string.`, 'color:red');
    }

    return this.dataParse(dataName);
  }

  add (dataName, data) {
    const currentData = this.dataParse(dataName);

    if (currentData) {
      window[this.storageType].setItem(dataName, JSON.stringify(merge({}, currentData, data)));
      debugLog(`local-data.js:%cData added to "${dataName}"`, 'color:green', data);
    } else {
      // this.put(dataName, data);
      debugLog(`local-data.js:%cStorage key "${dataName}" key created and data added to Storage`, 'color:green');
    }

    return this.dataParse(dataName);
  }

  update (dataName, data) {
    return this.add(dataName, data);
  }

  remove (dataName, key) {
    const storedData = this.dataParse(dataName);

    if (key) {
      this.put(dataName, omit(storedData, key));
    } else {
      window[this.storageType].removeItem(dataName);
    }

    if (storedData) {
      debugLog(`local-data.js:%cData removed in "${dataName}"`, 'color:green', this.dataParse(dataName));
    } else {
      debugLog(`local-data.js:%cData not removed in "${dataName}" because storage key isn\'t a string or does not exist.`, 'color:red');
    }

    return this.dataParse(dataName);
  }

  parseDate (date, pretty) {
    return pretty ? new Date(date).toString() : Date.parse(date);
  }

  isExpired (dataName) {
    const currentDate = Date.now();
    const expData = get(this.dataParse(dataName), '_expires');
    const expDate = expData ? this.parseDate(expData) : null;
    let expired = false;

    if (expDate && expDate <= currentDate) {
      expired = true;
      debugLog(`local-data.js:%cExpired data found in Storage`, 'color:green');
    }

    return expired;
  }

  clearExpired (dataName, nuke) {
    if (this.isExpired(dataName)) {
      debugLog('local-data.js:%cExpired data cleared in Storage', 'color:green', newObj);

      if (nuke) {
        this.remove(dataName);
      } else {
        this.put(dataName, {});
      }
    }
  }

  setExpire (dataName, days = 0) {
    const expireData = this.add(dataName, this.createExpire(days));

    if (expireData) {
      debugLog('local-data.js:%cExpired date set on data cleared in Storage', 'color:green', expireData);
    }

    return expireData;
  }

  createExpire (days = 0) {
    const currentDate = new Date();
    const endDate = this.parseDate(new Date().setDate(currentDate.getDate() + days), 'pretty');

    return { '_expires': endDate };
  }
}

export class LocalData extends BaseLocalData {
  constructor (dataName, storageType) {
    super(storageType);

    this.dataName = dataName;
  }

  dataParse () {
    return super.dataParse(this.dataName);
  }

  add (data) {
    return super.add(this.dataName, data);
  }

  update (data) {
    return super.add(this.dataName, data);
  }

  put (data) {
    return super.put(this.dataName, data);
  }

  remove (key) {
    return super.remove(this.dataName, key);
  }

  get (key) {
    return super.get(this.dataName, key);
  }

  setExpire (days = 0) {
    return super.setExpire(this.dataName, days);
  }

  isExpired () {
    return super.isExpired(this.dataName);
  }

  clearExpired () {
    return super.clearExpired(this.dataName);
  }
}

export const localDataStorage = new BaseLocalData();
export const sessionDataStorage = new BaseLocalData('sessionStorage');
