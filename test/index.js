var reportBlocked = require('../')
var assert = require('assert')
var reports = 0
var recentReport = '';

var p = reportBlocked(Promise, {
    report: function reporter(rep) {
        reports++
        recentReport = rep
        console.log(rep)
    }
})

function blockingChain1() {
    return p.resolve().then(function block1() {
        var d1 = +new Date();
        while ((+new Date()) - d1 < 200) {
            new Array(100000).join(',').split(',')
        }
    })
}

function blockingChain2() {
    var something={
        method1:function(){
            var d1 = +new Date();
            while ((+new Date()) - d1 < 200) {
                new Array(100000).join(',').split(',')
            }
        }
    }
    return p.resolve()
        .then(function ok1() {
            return 'regular result'
        })
        .then(function block2() {
            return something.method1()
        })
}

function goodChain1() {
    return p.resolve()
        .then(function ok1() {
            return 'regular result'
        })
        .then(function ok2() {
            new Array(100000).join(',').split(',')
        })
}

(function shouldReportBlockingFunctionPassedToThen() {
    blockingChain1().then(function() {
        assert(reports === 1, 'incorrect number of reports collected: ' + reports)
        assert(!!recentReport.match(/function block1/), 'incorrect report test ' + recentReport)
        assert(!!recentReport.match(/blockingChain1/), 'stacktrace missing ' + recentReport)
    }).catch(console.error)
})();

(function shouldReportBlockingFunctionPassedToThenButNotOther() {
    blockingChain2().then(function() {
        assert(reports === 2, 'incorrect number of reports collected: ' + reports)
        assert(!!recentReport.match(/function block2/), 'incorrect report test ' + recentReport)
        assert(!!recentReport.match(/blockingChain2/), 'stacktrace missing ' + recentReport)
    }).catch(console.error)
})();

(function shouldNotReportNonBlockingFunctions() {
    goodChain1().then(function() {
        assert(reports === 2, 'incorrect number of reports collected: ' + reports)
    }).catch(console.error)
})();
