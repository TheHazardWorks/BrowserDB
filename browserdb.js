/*
MIT License

Copyright (c) 2019 HazardWorks (https://twitter.com/HazardWorks)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
class BrowserDBError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BrowserDBError';
    }
}

class BrowserDB {
    constructor(options) {
        this.prefix = options.prefix || 'browserdb:';
        this.backup = {};
        try {
            this.store = localStorage;
        } catch(e) {
            throw new BrowserDBError(e);
        }
        try {
            this.encode = window.btoa;
            this.decode = window.atob;
            this.canCode = true;
        } catch(e) {
            this.encode = null;
            this.decode = null;
            this.canCode = false;
            new BrowserDBError('Cannot encode/decode in this browser');
        }
    }
    _makePrefix(key = '') {
        let prefix = (this.prefix.endsWith(':')) ? this.prefix : this.prefix + ':';
        return String(`${prefix}${key}`);
    }
    _warn(message) {
        console.warn(`%c[BrowserDB] %c${message}`, 'color: #efcc00; font-weight: bold;', '');
    }
    _error(message) {
        console.error(`%c[BrowserDB] %c${message}`, 'color: #ef0000; font-weight: bold;', '')
    }
    _log(message) {
        console.log(`%c[BrowserDB] %c${message}`, 'color: #0000ef; font-weight: bold;', '')
    }
    _isObject(data) {
        try { JSON.parse(data); } catch(_) { return false };
        return true;
    }
    _allValidStoreKeys() {
        let prefix = this._makePrefix();
        let lsKeys = Object.keys(localStorage);
        let returned = new Array();
        for(let i = 0; i < lsKeys.length; i++) {
            if(lsKeys[i].startsWith(prefix)) {
                returned.push(lsKeys[i]);
            }
        }
        return returned;
    }
    toString() {
        return '[object BrowserDB]';
    }
    saveItem(key, value) {
        let hValue = (typeof value == 'string') ? value : JSON.stringify(value);
        let thisKey = this._makePrefix(key);
        if(!this.canCode) {
            this.store.setItem(thisKey, hValue);
        } else {
            let encoded = this.encode(hValue);
            this.store.setItem(thisKey, encoded);
        }
    }
    fetchItem(key) {
        let thisKey = this._makePrefix(key);
        if(this.canCode) {
            try {
                let encoded = this.store.getItem(thisKey);
                let decoded = this.decode(encoded);
                if(this._isObject(decoded)) {
                    return JSON.parse(decoded);
                } else {
                    return decoded;
                }
            } catch(e) {
                this._warn(e);
                return undefined;
            }
        } else {
            try {
                let data = this.store.getItem(thisKey);
                if(this._isObject(data)) {
                    return JSON.parse(data);
                } else {
                    return data;
                }
            } catch(e) {
                this._warn(e);
                return undefined;
            }
        }
    }
    deleteItem(key) {
        let thisKey = this._makePrefix(key);
        this.store.removeItem(thisKey);
    }
    deleteAllItems() {
        let keys = this._allValidStoreKeys();
        for(let i = 0; i < keys.length; i++) {
            this.store.removeItem(keys[i]);
        }
    }
    saveBackup() {
        let keys = this._allValidStoreKeys();
        keys.forEach((key) => {
            this.backup[key] = this.store.getItem(key);
        })
        this.setItem('___BACKUP___', this.backup);
    }
    loadBackup() {
        let backup = this.fetchItem('___BACKUP___');
        let keys = Object.keys(backup);
        keys.forEach((key) => {
            this.store.setItem(key, backup[key]);
        })
        this.backup = backup;
    }
    copyright() {
        return String(`BrowserDB (c) HazardWorks ${new Date().getFullYear()}`);
    }
}
