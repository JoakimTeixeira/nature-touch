const gulp = require("gulp");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");

/**
 * @function
 * @description Allows browser sync.
 * @param {Function} done
 */
function browserSync(done) {
  sync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });

  done();
}

/**
 * @function
 * @description Reload current page in browser.
 * @param {Function} done
 */
function browserSyncReload(done) {
  sync.reload();
  done();
}

/**
 * @function
 * @description Covert sass files to a single minified css file.
 */
function scss() {
  return gulp
    .src("./styles/sass/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./styles/css"))
    .pipe(sync.stream());
}

/**
 * @function
 * @description Watch source files for auto reload function.
 */
function watchFiles() {
  gulp.watch("./styles/sass/*.scss", scss, browserSyncReload);
  gulp.watch("./styles/css/*.css", browserSyncReload);
  gulp.watch("./*.html", browserSyncReload);
}

/**
 * @description Gulp tasks
 */
const build = scss;
const server = gulp.series(
  browserSync,
  gulp.parallel(watchFiles, browserSyncReload)
);

/**
 * @description Run "gulp build" to generate production files and "gulp server" to start development server, access in port 3000.
 */
exports.build = build;
exports.server = server;
