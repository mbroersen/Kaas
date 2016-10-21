var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

gulp.task('jsminify', function () {

    return browserify({entries: ['./src/js/main.jsx'], extensions: ['.jsx'], debug: false, standalone: "Kaas"}).transform(babelify)
        .bundle()
        .pipe(source('kaas.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('build/js/'));

});

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
});



//gulp.task("watch", ['jsminify'], function () {
//
//});

