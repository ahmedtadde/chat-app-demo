const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');


gulp.task('default', () =>
    gulp.src('./src/public/styles.css')
        .pipe(autoprefixer({
            browsers: ['last 50 versions'],
            cascade: false
        }))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
          }))
        .pipe(gulp.dest('./dist/css/'))
);