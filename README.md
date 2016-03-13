# promise-blocked
Detect which function blocks your eventloop.

## Usage

Tools like this are not intended for use in production (unless you're really desperate)

```javascript
var promiseBlocked = require('promise-blocked')
promiseBlocked(Promise, {
    report: function reporter(rep) {
        console.log(rep) //or send to logs
    }
})
```

All functions passed to `.then` will be measured for their execution time. Functions with execution time over 10ms will be reported to you:

```
slow function (202ms) signature:'function block1() {'     at blockingChain1 (test/index.js:15:24)    at shouldReportBlockingFunctionPassedToThen (test/index.js:52:5)    at Object.<anonymous> (test/index.js:57:3)
```



## TODO

* bluebird support
* cover more methods than just `.then`
