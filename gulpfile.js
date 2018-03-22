const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const babel = require('gulp-babel');
const uglyfly = require('gulp-uglyfly');


gulp.task('copy-html-file', () => {
    gulp.src('./src/client/index.html')
        .pipe(plumber())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css-file', () => {
    gulp.src('./src/client/styles.css')
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ["last 50 versions", ">= 0.1%","ie 6-11"],
            cascade: false
        }))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
          }))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js-script', () => {
    gulp.src('src/client/index.js')
        .pipe(plumber())
        .pipe(babel({
            "presets": [
              ["env", {
                "targets": {
                  "browsers": ["last 50 versions", ">= 0.1%","ie 6-11"]
                }
              }]]
            })
        .pipe(uglyfly())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {

    gulp.watch('./src/client/index.html', ['copy-html-file']);
    gulp.watch('./src/client/styles.css', ['minify-css-file']);
    gulp.watch('./src/client/index.js', ['minify-js-script']);

});

gulp.task('default', ['copy-html-file','minify-css-file','minify-js-script', 'watch']);
