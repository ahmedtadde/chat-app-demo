const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const babel = require('gulp-babel');
const uglyfly = require('gulp-uglyfly');


gulp.task('minify-css-files', () => {
    gulp.src('./src/client/styles.css')
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
          }))
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js-scripts', () => {
    gulp.src('src/client/index.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglyfly())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {
    gulp.watch('./src/client/styles.css', ['minify-css-files']);
    gulp.watch('./src/client/index.js', ['minify-js-scripts']);
});

gulp.task('default', ['minify-css-files','minify-js-scripts', 'watch']);
