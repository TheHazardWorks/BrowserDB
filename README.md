# BrowserDB
A dumb class made for a better localStorage in the Browser.

### But Why?
To be honest I have no idea. I just like having a clean and usable localStorage 
with better Object storing abilities

### Contact
- [HazardWorks](https://twitter.com/HazardWorks) On Twitter

### Usage
To setup the BrowserDB this is a simple task
```html
<script src="browserdb.min.js"></script>
<script type="text/javascript">
let mydb = new BrowserDB();
</script>
```

There are options to use within the setup (More will come in the future)
```js
// This tells the database to prefix all LS keys with "cooldb"
let customDB = new BrowserDB({ prefix: 'cooldb' })
```

Here is the available capabilities of the class
```js
// Establish your custom localstorage!
let customDB = new BrowserDB({ prefix: 'cooldb' });

// Set an item to it (Compatible with Arrays and Objects)
customDB.saveItem('name','john smith');
// If you can Encode:
// [cooldb:name] "am9obiBzbWl0aA=="
// Else:
// [cooldb:name] "john smith"

// Returns a String or Stored Object/Array
customDB.fetchItem('name');

// Deletes an entry
customDB.deleteItem('name');

// Delete all entries
customDB.deleteAllItems();

// Creates a backup of all entries in one item
customDB.saveBackup();
// [cooldb:___BACKUP___] <all keys>

// Load the backup to storage
customDB.loadBackup();
```
