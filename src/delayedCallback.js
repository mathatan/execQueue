(function(define) { 
    'use strict';

    define(function () {
        var native, timing;

        var cbTimeout, nextCall = Infinity, cbUpdateFn, cbMessageName = 'execQueueDelayedExecution';

        if (window) {
            window.addEventListener('message', function (e) {
                if (event.source === window && e.data === cbMessageName && cbUpdateFn) {
                    e.stopPropagation();
                    cbUpdateFn(); 
                }
            }, true);
        }
        var cbDelay = function (delay) {
            var ts = timing.perf() + delay;
            if (nextCall < ts) {
                return;
            }

            if (cbTimeout) {
                native.clearTimeout(cbTimeout);
                cbTimeout = undefined;
            }

            nextCall = ts;

            if (delay > 5) {
                cbTimeout = native.setTimeout(cbUpdateFn, delay); 
            } else if (window) {
                window.postMessage(cbMessageName, '*');
            } else if (process) {
                process.nextTick(cbUpdateFn);
            } else {
                cbUpdateFn();
            }
        };

        return function (_native, _timing) {
            native = _native;
            timing = _timing;

            return {
                call : cbDelay,
                setCallback : function (fn, context) {
                    cbUpdateFn = function () {
                        fn.call(context);
                    };
                }
            };
        };

    });
})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
