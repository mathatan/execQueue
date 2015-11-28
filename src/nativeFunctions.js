(function(define) {
    'use strict';

    var _timeout,
        _interval,
        _clearTimeout,
        _clearInterval,
        _reqFrame,
        _clearFrame,
        _priorityFrame;

    var timeoutTest = function (one, two, three) {
        // only if not supported ...
        if (!one || !two || !three) {
            var slice = [].slice,
            // trap original versions
            __timeout = window && window.setTimeout || setTimeout,
            __interval = window && window.setInterval || setInterval,
            // create a delegate
            delegate = function (callback, $arguments) {
                $arguments = slice.call($arguments, 2);
                return function () {
                    callback.apply(null, $arguments);
                };
            };
            // redefine original versions
            _timeout = function (callback, delay) {
                return __timeout(delegate(callback, arguments), delay);
            };
            _interval = function (callback, delay) {
                return __interval(delegate(callback, arguments), delay);
            };
        }
    };

    if (window) {
        // Get native code implementations of setTimeout, setInterval and requestAnimationFrame
        _timeout = window.setTimeout;
        _interval = window.setInterval;
        _clearTimeout = window.clearTimeout;
        _clearInterval = window.clearInterval;
        _reqFrame = window.requestAnimationFrame;
        _clearFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
        _priorityFrame = window.requestAnimationFrame;

        if (_reqFrame === undefined) {
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for (var x = 0; x < vendors.length && _reqFrame === undefined; ++x) {
                _reqFrame = window[vendors[x] + 'RequestAnimationFrame'];
                _clearFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
        }

        // Verify that the setTimeout and setInterval works as expected
        setTimeout(timeoutTest, 0, 1, 1, 1);
    } else {
        _timeout = setTimeout;
        _interval = setInterval;
        _clearTimeout = clearTimeout;
        _clearInterval = clearInterval;
    }

    define(function (require) {

        var timing = require('./timing.js');

        // Polyfill requestAnimationFrame

        if (!_reqFrame) {
            var lastTime = timing.perf();
            _reqFrame = function (callback) {
                var currTime = timing.perf();
                var timeToCall = Math.max(0, (1000 / 60) - (currTime - lastTime));
                var id = _native.timeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!_clearFrame) {
            _clearFrame = function (id) {
                _native.clearTimeout(id);
            };
        }

        var _native = {
            _timeout : _timeout,
            _interval : _interval,
            _clearTimeout : _clearTimeout,
            _clearInterval : _clearInterval,
            _reqFrame : _reqFrame,
            _clearFrame : _clearFrame,
            // Might not really work with node.js
            timeout : function () { return this._timeout.apply(window, arguments); },
            interval : function () { return this._interval.apply(window, arguments); },
            clearTimeout : function () { return this._clearTimeout.apply(window, arguments); },
            clearInterval : function () { return this._clearInterval.apply(window, arguments); },
            reqFrame : function () { return this._reqFrame.apply(window, arguments); },
            clearFrame : function () { return this._clearFrame.apply(window, arguments); }
        };

        return _native;
    });
})(typeof define === 'function' && define.amd ?
    define :
    function (factory) { 'use strict'; module.exports = factory(require); }
);
