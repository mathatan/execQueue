// karma.conf.js

module.exports = function(config) {
    'use strict';
    config.set({
        browserify: {
            debug: true,
            watch: true,
            transform: ['browserify-shim'],
            paths : ['./bower_components', './src'],
            plugin : ['proxyquireify/plugin']
        },
        frameworks: ['browserify', 'jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'execQueue.js' : [ 'browserify' ],
            'execQueueWithWrapper.js' : [ 'browserify' ],
            'src/**/*.js': [ 'browserify' ],
            'test/**/*.js': [ 'browserify' ]
        },        
        files: [
            //'execQueue.js',
            //'execQueueWithWrapper.js',
            'test/**/*.js'
        ]
    });
};
