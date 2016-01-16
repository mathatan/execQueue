(function(define) {
    'use strict';

    var timing = require('timing'),
        native = require('nativeFunctions');

    var id = 0;

    var DelayedCallback = function () {
        this.id = 'dex_' + id++;

        // Force break on the next execution cycle
        this._b = false;
        // Count of executions without proper break 
        this._c = 0;
        // Next execution
        this._n = Infinity;

        var instance = this;

        if (window) {
            window.addEventListener('message', function (e) {
                if (event.source === window && e.data === instance.id && instance._cbFn) {
                    e.stopPropagation();
                    instance._cbFn();
                }
            }, true);
        }
    };

    DelayedCallback.prototype = {
        clear : function (fn, context) {
            if (this._fId) {
                native.cancelAnimationFrame(this._fId);
                this._fId = undefined;
            }

            if (this._tId) {
                native.clearTimeout(this._tId);
                this._tId = undefined;
            }

            // Waiting for execution
            this._w = false;

            if (fn) {
                this.set(fn, context);
            }
        },
        call : function (delay, immediate) {
            // Current execution start time
            this._s = timing.perf();

            var ts = this._s + delay;

            // Skip call if, next execution is on short delay,
            // Next scheduled execution is less than 2ms away,
            // or if next execution is waiting for break
            if (this._w ||
                !((this._s - this._n) >> 2) ||
                (this._n - ts < 0) && (this._fId || this._tId)
               ) {
                return;
            }

            this.clear();

            this._n = ts;

            immediate = (immediate && this._c < 10);

            var forceFrame = (delay < 3 && this._c > 9) || this._b;

            if (delay > 20) {
                this._tId = native.setTimeout(this._cbFn, delay);
            } else if (delay > 2 || forceFrame) {
                this._fId = native.requestAnimationFrame(this._cbFn);
            } else if (window && !immediate) {
                this._c = this._c + 1;

                this._w = true;
                window.postMessage(this.id, '*');
            } else if (process && !immediate) {
                this._c = this._c + 1;

                this._w = true;
                process.nextTick(this._cbFn);
            } else {
                this._c = this._c + 1;

                this._cbFn();
            }
        },
        set : function (fn, context) {
            var instance = this;
            this._cbFn = function () {
                var now = timing.perf();

                instance.clear();
                instance._c = (now - instance._s > 8) ? (0) : (instance._c);
                instance._b = fn.call(context);
            };
        }
    };

    define(function () {
        return DelayedCallback;
    });
})(typeof define === 'function' && define.amd ?
    define :
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
