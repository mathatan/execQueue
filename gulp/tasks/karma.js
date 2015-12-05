'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var path = require('path');

module.exports = gulp.task('karma', function (done) {
    return new Server({
        configFile: path.resolve(config.paths.src.karmaConf),
        singleRun : (release) ? (true) : (false)
    }, done).start();
});
