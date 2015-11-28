(function(define) { 
    'use strict';

    var execInstance;

    define(function (require) {
        var ExecQueue = require('./lib/execQueue.js');
        var nativeFunctions = require('./lib/nativeFunctions.js');

        return function (config) { 
            if (execInstance) {
                execInstance.reconfigure(config);
            }

            execInstance = execInstance || new ExecQueue(config, nativeFunctions);

            return execInstance;
        };
    });
})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
);
