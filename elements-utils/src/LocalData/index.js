import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isPlainObject from 'lodash/isPlainObject';
import _merge from 'lodash/merge';
import _omit from 'lodash/omit';

import { debugLog } from 'General';

class LocalData {
  constructor(dataName, storageType = 'localStorage') {
    this.storageType = storageType;
    this.dataName = dataName;
    this.cachedData = this.dataParse();
  }

  dataParse() {
    return JSON.parse(window[this.storageType].getItem(this.dataName) || '{}');
  }

  get(key) {
    const data = key ? _get(this.cachedData, key) : this.cachedData;

    if (data && !_isEmpty(data)) {
      debugLog(`LocalData.get:%cData found in "${this.dataName}"`, 'color:green', data);
    } else {
      debugLog(`LocalData.get:%cStorage key in "${this.dataName}" not found because key isn\'t a string or does not exist.`, 'color:red');
    }

    return data;
  }

  add(data = {}) {
    this.cachedData = _merge({}, this.cachedData, data);

    window[this.storageType].setItem(this.dataName, JSON.stringify(this.cachedData));

    debugLog(`LocalData.add:%cData added to "${this.dataName}"`, 'color:green', this.cachedData);

    // Returning "dataParse" so the cached data can't be mutated accidentally.
    // The JSON.parse it does automatically "clones" the object.
    return this.dataParse();
  }

  update(data) {
    return this.add(data);
  }

  put(data = {}, key) {
    if (this.cachedData[key]) {
      this.cachedData[key] = data;
    } else if (_isPlainObject(data)) {
      this.cachedData = data;
    }

    window[this.storageType].setItem(this.dataName, JSON.stringify(this.cachedData));
    debugLog(`LocalData.put:%cData overwritten in "${this.dataName}"`, 'color:green', this.cachedData);

    // Returning "dataParse" so the cached data can't be mutated accidentally.
    // The JSON.parse it does automatically "clones" the object.
    return this.dataParse();
  }

  remove(key) {
    this.cachedData = _omit(this.cachedData, key);

    this.put(this.cachedData);

    debugLog(`LocalData.remove:%cData (${key}) removed in "${this.dataName}"`, 'color:green', this.cachedData);

    // Returning "dataParse" so the cached data can't be mutated accidentally.
    // The JSON.parse it does automatically "clones" the object.
    return this.dataParse();
  }

  destroy() {
    this.cachedData = {};
  
    window[this.storageType].removeItem(this.dataName);

    debugLog(`LocalData.destroy:%c"${this.dataName}" in ${this.storageType} deleted`, 'color:green');
  }

  normalizeDate(date) {
    if (typeof (date) === 'number') {
      if (date.toString().length < 13) {
        return date * 1000;
      }

      return date;
    } else if (typeof (date) === 'string') {
      return Date.parse(date);
    } else {
      throw new Error('LocalData: Must pass valid timestamp or Date.');
    }
  }

  parseDate(date, pretty) {
    return pretty ? new Date(date).toString() : Date.parse(date);
  }

  createExpire(days = 0, currentDate) {
    const dateFrom = new Date(currentDate);
    const endDate = this.parseDate(new Date().setDate(dateFrom.getDate() + days), 'pretty');

    return { '_expires': endDate };
  }

  setExpire(days = 0, currentDate = Date.now()) {
    const expireDays = parseInt(days, 10);
  
    if (!isNaN(expireDays)) {
      const expireData = this.add(this.createExpire(expireDays, this.normalizeDate(currentDate)));
      if (expireData) {
        debugLog(`LocalData.setExpire:%cExpired date set on "${this.dataName}"`, 'color:green', expireData);
      }

      return expireData;
    }

    debugLog(`LocalData.setExpire:%cExpired date NOT set on "${this.dataName}" because number of days is invalid.`, 'color:red', this.cachedData);

    return this.cachedData;
  }

  isExpired(currentDate = Date.now()) {
    const expData = _get(this.dataParse(), '_expires');
    const expDate = expData ? this.parseDate(expData) : null;
    let expired = false;

    if (expDate && expDate <= this.normalizeDate(currentDate)) {
      expired = true;
      debugLog(`LocalData.isExpired:%cExpired data found in "${this.dataName}"`, 'color:green');
    }

    return expired;
  }

  clearExpired(currentDate = Date.now()) {
    if (this.isExpired(currentDate)) {
      this.put({});

      debugLog(`LocalData.clearExpired:%cExpired data cleared in "${this.dataName}"`, 'color:green');
    }
  }
}

export default LocalData;
