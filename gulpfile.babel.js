import gulp from "gulp";
import sequence from "run-sequence";
import {gulpSass, gulpSassDist} from "./tools/gulp/style";
import {gulpWebpackServe, gulpWebpackDist} from "./tools/gulp/scripts";
import {gulpWatch, gulpAssets, gulpClean} from "./tools/gulp/misc";

gulp.task('sass', gulpSass);
gulp.task('sass:dist', gulpSassDist);

gulp.task('webpack', gulpWebpackDist);
gulp.task('serve', ['sass', 'watch'], gulpWebpackServe);

gulp.task('watch', gulpWatch);

gulp.task('clean', gulpClean);
gulp.task('assets:dist', gulpAssets);

gulp.task('build', () => {
  return sequence(
    'clean',
    ['sass:dist', 'webpack', 'assets:dist']
  )
});

gulp.task('default', ['build']);
