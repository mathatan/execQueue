(function(define) { 
    'use strict';

    var execInstance;

    define(function (require) {
        var ExecQueue = require('./src/execQueue.js');
        var nativeFunctions = require('./src/nativeFunctions.js');
        var nativeWrapper = require('./src/nativeWrapper.js');

        return function (config) { 
            if (execInstance) {
                execInstance.reconfigure(config);
            }

            execInstance = execInstance || new ExecQueue(config, nativeFunctions, nativeWrapper);

            return execInstance;
        };
    });
})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
);
