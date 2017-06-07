import gulp from "gulp";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";

import {paths} from '../config'

export function gulpSass() {
  return gulp.src(paths.scssEntry)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.client))
    .pipe(browserSync.stream());
}

export function gulpSassDist() {
  return gulp.src(paths.scssEntry)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dist));
}
