var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
//gvar sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

gulp.task('jsminify', function () {

    return browserify({entries: ['./src/js/Kaas.jsx'], extensions: ['.jsx'], debug: false, standalone: "Kaas"})
        .transform(babelify)
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

gulp.task('docs', function () {
    const fs = require('fs');
    const jsdoc2md = require('jsdoc-to-markdown');

    const output = jsdoc2md.renderSync({ files: 'src/js/component/datagrid/DataGrid.jsx' });
    fs.writeFileSync('DataGrid.md', output);

    const output2 = jsdoc2md.renderSync({ files: 'src/js/formatter/*.jsx' });
    fs.writeFileSync('Formatters.md', output2);

    const output3 = jsdoc2md.renderSync({ files: 'src/js/plugin/*.jsx' });
    fs.writeFileSync('Plugins.md', output3);

    const output4 = jsdoc2md.renderSync({ files: 'src/js/util/UtilObject.jsx'});
    fs.writeFileSync('Utils.md', output4);

})

//gulp.task("watch", ['jsminify'], function () {
//
//});

