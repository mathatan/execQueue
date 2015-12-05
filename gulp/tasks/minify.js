'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');

var genMinify = function (type) {
    return gulp.task('minify:' + type, function () {
        return gulp.src(config.paths.dest.release.scripts + '/' + config.filenames.release[type])
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dest.release.scripts));
    });
};

module.exports = {
    all : function () {
        return gulp.task('minify', function (cb) {
            runSequence(
                'minify:withWrapper',
                'minify:withoutWrapper',
                cb);
        });
    },
    withWrapper : genMinify('withWrapper'),
    withoutWarpper : genMinify('withoutWarpper')
};
