# BrowserDB
A dumb class made for a better localStorage in the Browser.

### But Why?
To be honest I have no idea. I just like having a clean and usable localStorage 
with better Object storing abilities

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
