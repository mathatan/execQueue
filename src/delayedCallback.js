(function(define) { 
    'use strict';

    define(function () {
        var native, timing;

        var cbTimeout, cbFrameId, waiting, 
            nextCall = Infinity, 
            cbUpdateFn, 
            cbMessageName = 'execQueueDelayedExecution';

        if (window) {
            window.addEventListener('message', function (e) {
                if (event.source === window && e.data === cbMessageName && cbUpdateFn) {
                    e.stopPropagation();
                    cbUpdateFn(); 
                }
            }, true);
        }
        var clearCallbacks = function () {
            if (cbFrameId) {
                native.cancelAnimationFrame(cbFrameId);
                cbFrameId = undefined;
            } 
            
            if (cbTimeout) {
                native.clearTimeout(cbTimeout);
                cbTimeout = undefined;
            }

            waiting = false;           
        };
        var cbDelay = function (delay) {
            var now = timing.perf(),
                ts = now + delay;

            if (waiting ||
                !((now - nextCall) >> 2) ||
                (nextCall - ts < 0) && (cbFrameId || cbTimeout)) {
                return;
            }

            clearCallbacks();

            nextCall = ts;

            if (delay > 20) {
                cbTimeout = native.setTimeout(cbUpdateFn, delay); 
            } else if (delay > 2) {
                cbFrameId = native.requestAnimationFrame(cbUpdateFn); 
            } else if (window) {
                waiting = true;
                window.postMessage(cbMessageName, '*');
            } else if (process) {
                waiting = true; 
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
                        clearCallbacks();
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
