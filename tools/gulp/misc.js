import gulp from "gulp";
import gutil from "gulp-util";
import path from "path";
import del from "del";
import es from "event-stream";

import {paths} from "../config";

export function gulpWatch() {
  return gulp.watch(paths.scssBatch, ['sass'])
}

export function gulpAssets() {
  let assets = gulp.src(paths.assets)
    .pipe(gulp.dest(path.join(paths.dist, 'assets')));

  let copy = gulpCopy();

  return es.merge(assets, copy);
}

// todo: handle copy without gulp stream
export function gulpCopy() {
  return gulp.src(path.join('node_modules', 'semantic-ui-css/themes/**/*'))
    .pipe(gulp.dest(path.join(paths.dist, 'themes')))
}

export function gulpClean(cb) {
  del([paths.dist]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
}
