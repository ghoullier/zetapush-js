import "babel-polyfill"

import gulp from "gulp"
import babel from "gulp-babel"
import rename from "gulp-rename"
import uglify from "gulp-uglify"
import concat from "gulp-concat"

const COMETD_PATH = 'vendor/cometd/';
const LOGLEVEL_PATH = 'vendor/loglevel/';
const QWEST_PATH = 'vendor/qwest/';

const VENDOR_FILES = [
  `${COMETD_PATH}cometd-namespace.js`,
  `${COMETD_PATH}CometD.js`,
  `${COMETD_PATH}Utils.js`,
  `${COMETD_PATH}cometd-json.js`,
  `${COMETD_PATH}Transport.js`,
  `${COMETD_PATH}RequestTransport.js`,
  `${COMETD_PATH}TransportRegistry.js`,
  `${COMETD_PATH}WebSocketTransport.js`,
  `${COMETD_PATH}LongPollingTransport.js`,
  `${LOGLEVEL_PATH}loglevel.js`,
  `${QWEST_PATH}loglevel.js`,
];

const SOURCE_FILES = [
  `src/zetapush.js`,
  `src/_base.js`,
  `src/generic.js`,
  `src/authentication/simple.js`,
  `src/authentication/weak.js`
];

gulp.task('build', () => {
  return gulp.src([...VENDOR_FILES, ...SOURCE_FILES])
    .pipe(concat('zetapush.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['build'])
