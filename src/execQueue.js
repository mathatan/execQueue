(function(define) { 
    'use strict';

    define(function (require) {

        var timing = require('./timing.js');
        var List = require('./list.js');
        var delayedCallback = require('./delayedCallback.js');

        var native, wrapper;

        var ExecQueue = function (config, _native, _wrapper) {
            native = native || _native;
            wrapper = wrapper || _wrapper;

            this.list = new List();
            this._run = delayedCallback(native, timing);

            this._run.setCallback(this.exec, this);
        };

        ExecQueue.prototype = {
            constructor : ExecQueue,
            add : function (fn, delay) {
                if (!fn) {
                    return;
                }

                delay = delay || 0;
                
                var ts = timing.perf();

                var i = 2, iLen = arguments.length, args;
                if (iLen > i) {
                    // Passing arguments as a parameter prevents function optimization so instead loop them manually.
                    args = new Array(iLen - i);
                    while(i < iLen) { args[i - 2] = arguments[i]; i++; }
                }

                var loop = false;
                if (isNaN(delay) && delay.charAt(0) === 'l') {
                    loop = true;
                    delay = parseFloat(delay.substring(1));
                }

                var frame;
                if (isNaN(delay) && delay.charAt(0) === 'f') {
                    frame = true;
                    delay = parseFloat(delay.substring(1));
                }
                
                var priority;
                if (isNaN(delay) && delay.charAt(0) === 'p') {
                    priority = true;
                }

                var id;

                if (priority) {
                    id = this.priorityList.add({
                        ts : ts, 
                        fn : fn, 
                        args : args
                    });
                } else {
                    id = this.list.add({
                        loop : loop,
                        frame : frame,
                        ts : ts + delay, 
                        delay : delay, 
                        fn : fn, 
                        args : args
                    });
                }

                this.run(delay || 0);

                return id;
            },
            priority : function () {
                var i = 0, iLen = arguments.length, args;
                if (iLen > i) {
                    // Passing arguments as a parameter prevents function optimization so instead loop them manually.
                    args = new Array(iLen - i);
                    while(i < iLen) { args[i - 2] = arguments[i]; i++; }
                }
                args[1] = 'p' + args[1];

                return this.add.apply(this, args);
            },
            frame : function () {
                var i = 0, iLen = arguments.length, args;
                if (iLen > i) {
                    // Passing arguments as a parameter prevents function optimization so instead loop them manually.
                    args = new Array(iLen - i);
                    while(i < iLen) { args[i - 2] = arguments[i]; i++; }
                }
                args[1] = 'f' + args[1];

                return this.add.apply(this, args);
            },
            loop : function () {
                var i = 0, iLen = arguments.length, args;
                if (iLen > i) {
                    // Passing arguments as a parameter prevents function optimization so instead loop them manually.
                    args = new Array(iLen - i);
                    while(i < iLen) { args[i - 2] = arguments[i]; i++; }
                }
                args[1] = 'l' + args[1];

                return this.add.apply(this, args);
            },
            remove : function (id) {
                this.list.remove(this.list.find(id));
            },
            run : function (delay) {
                this._run.call(delay);
            }
        };
        
        return ExecQueue;
    });
})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
