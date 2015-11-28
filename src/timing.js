(function(define) { 
    'use strict'; 

    var _performanceStart;

    var _dateNow = (!Date.now) ? function () {
        return new Date().getTime();
    } : Date.now;

    var _perf = window && window.performance;

    if (!_perf && process) {
        _performanceStart = process.hrtime();

        _perf = {
            now : function () {
                var now = process.hrtime(_performanceStart);
                return now[0] + now[1] * 1e-9;
            }
        };

    } 
    
    if (!_perf && window) {
        _performanceStart = _dateNow();

        _perf = {
            now : function () {
                var now = _dateNow();
                return now - _performanceStart;
            }
        };
    }

    var _perfNow = function () { return _perf.now(); };

    define(function () {
        return {
            perf : _perfNow,
            date : _dateNow
        };
    });

})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
);
