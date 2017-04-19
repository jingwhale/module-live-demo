'use strict';
const gulp = require('gulp');
const istanbul = require('gulp-istanbul');

gulp.task('html', function() {
  return gulp.src(['src/**/*.html'])
    .pipe(gulp.dest('./test/src'));
});

gulp.task('css', function() {
  return gulp.src(['src/**/*.css'])
    .pipe(gulp.dest('./test/src'));
});

gulp.task('js', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(istanbul({
      coverageVariable: '__coverage__'
    }))
    .pipe(gulp.dest('./test/src'));
});

gulp.task('coverage', function(){
    gulp.run('html', 'css', 'js');
});
