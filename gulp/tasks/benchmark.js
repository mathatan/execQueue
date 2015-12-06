'use strict';

var gulp = require('gulp'),
    glob = require('glob');

module.exports = gulp.task('benchmark', function (cb) {
    glob(config.paths.src.benchmarks, function (er, files) {
        files.forEach(function (file) {
            require('../../' + file);
        });
        cb();
    });
});
