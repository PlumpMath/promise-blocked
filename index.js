var util = require('util')

function reportBlocked(promiseClass, opts) {
    opts = opts || {}
    var reporter = opts.report || console.warn.bind(console)

    var then = promiseClass.prototype.then
    promiseClass.prototype.then = function(a, b, c) {
        var recordedStack = (new Error).stack.split("\n").slice(2, 5).join("");
        return then.call(this,
            measure(a, reporter, recordedStack),
            measure(b, reporter, recordedStack),
            measure(c, reporter, recordedStack)
        );
    };
    return promiseClass
}

function measure(targetFunc, reporter, recordedStack) {
    if (!targetFunc) {
        return
    }
    return function() {
        var before = +new Date()
        var re = targetFunc.apply(this, arguments)
        var timeTaken = +new Date() - before
        if (timeTaken > 10) {
            reporter(util.format("blocking function (%sms) signature:'%s'", timeTaken, targetFunc.toString().split("\n")[0], recordedStack))
        }
        return re;
    }
}

module.exports = reportBlocked;
