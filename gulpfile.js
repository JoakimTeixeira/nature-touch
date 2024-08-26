const gulp = require("gulp");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

/**
 * @function
 * @description Initializes a local development server and serves files from the base directory.
 * @param {Function} done - Callback to signal the end of the task.
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
 * @description Reloads the browser page when file changes are detected.
 * @param {Function} done - Callback to signal the end of the task.
 */
function browserSyncReload(done) {
  sync.reload();
  done();
}

/**
 * @function
 * @description Compiles SASS files into minified CSS, adds source maps, and outputs the result with a `.min` suffix.
 */
function minifyScss() {
  return gulp
    .src("./styles/sass/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./styles/css"))
    .pipe(sync.stream()); // Avoids full page reload when CSS files are updated
}

/**
 * @function
 * @description Monitors specified files for changes, automatically compiling SASS files and reloading the page.
 */
function watchFiles() {
  gulp.watch("./styles/sass/*.scss", minifyScss, browserSyncReload);
  gulp.watch("./styles/css/*.css", browserSyncReload);
  gulp.watch("./*.html", browserSyncReload);
}

/**
 * @description Main tasks: runs gulp tasks in sequence and in parallel.
 */
const build = minifyScss;
const server = gulp.series(
  browserSync,
  gulp.parallel(watchFiles, browserSyncReload)
);

/**
 * @description Exported Tasks:
 * - `gulp build` - Compile SASS files into minified CSS.
 * - `gulp server` - Start the development server and watch files for changes.
 */
exports.build = build;
exports.server = server;
