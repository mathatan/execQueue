(function(define) { 
    'use strict';

    define(function () {
        var log = {
            config : { },
            log : function () {
                if (console || window.console) {
                    console.log.apply(console, arguments);
                }
            },
            info : function () {
                if (this.config.dev && this.config.dev.debugLevel < 1) {
                    if (console && console.info || window.console && window.console.info) {
                        console.info.apply(console, arguments);
                    } else if (console || window.console) {
                        console.log.call(console, 'INFO: ' + arguments.join(', '));
                    }
                }
            },
            warn : function () {
                if (console && console.warn || window.console && window.console.warn) {
                    console.warn.apply(console, arguments);
                } else if (console || window.console) {
                    console.log.call(console, 'WARN: ' + arguments.join(', '));
                }
            },
            error : function () {
                if (console && console.error || window.console && window.console.error) {
                    console.error.apply(console, arguments);
                } else if (console || window.console) {
                    console.log.call(console, 'ERROR: ' + arguments.join(', '));
                }
            }
        };

        return log;

    });
})(typeof define === 'function' && define.amd ? 
    define : 
    function (factory) { 'use strict'; module.exports = factory(require); }
  );
