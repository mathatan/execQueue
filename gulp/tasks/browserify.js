'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserifyShim = require('browserify-shim');
var runSequence = require('run-sequence');

var genBrowserify = function (item) {
    return gulp.task('browserify:' + item, function () {
        return browserify({
            entries: [config.paths.src[item]],
            paths : config.paths.src.browserify
        })
        .transform(browserifyShim)
        .bundle()
        .pipe(source(config.filenames.release[item]))
        .pipe(gulp.dest(config.paths.dest.release.scripts));
    });
};

module.exports = {
    all : function () {
        return gulp.task('browserify', function (cb) {
            runSequence(
                'browserify:withWrapper',
                'browserify:withoutWrapper',
                cb);
        });
    },
    withWrapper : genBrowserify('withWrapper'),
    withoutWarpper : genBrowserify('withoutWarpper')
};
