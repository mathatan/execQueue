'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

module.exports = gulp.task('default', function () {
  if (release) {
    runSequence(
      'clean',
      ['lint', 'benchmark', 'karma'],
      'browserify',
      'minify'
    );
  } else {
    runSequence(
      'clean',
      'lint',
      'benchmark',
      'karma'
    );
  }
});
