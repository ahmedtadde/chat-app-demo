const gulp = require('gulp');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const babel = require('gulp-babel');
const uglyfly = require('gulp-uglyfly');

gulp.task('default', () => {
    gulp.src('./src/public/styles.css')
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

    gulp.src('src/public/index.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglyfly())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('./dist/'));
});
