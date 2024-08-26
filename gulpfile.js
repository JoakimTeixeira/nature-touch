const { src, dest, watch, series } = require("gulp");
const { init, reload, stream } = require("browser-sync").create();
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));

/**
 * @function
 * @description Initializes a local development server and serves files from the base directory.
 * @param {Function} done - Callback to signal the end of the task.
 */
function browserSync(done) {
  init({
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
  reload();
  done();
}

/**
 * @function
 * @description Compiles SASS files into minified CSS, adds source maps, and outputs the result with a `.min` suffix.
 */
function minifyScss() {
  return src("./styles/sass/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./styles/css", { sourcemaps: true }));
}

/**
 * @function
 * @description Monitors specified files for changes, automatically compiling SASS files and reloading the page.
 */
function watchFiles() {
  watch("./styles/sass/*.scss", minifyScss);
  watch("./styles/css/*.css", browserSyncReload);
  watch("./*.html", browserSyncReload);
}

/**
 * @description Main tasks: runs gulp tasks in sequence and in parallel.
 */
const build = minifyScss;
const server = series(browserSync, watchFiles);

/**
 * @description Exported Tasks:
 * - `gulp build` - Compile SASS files into minified CSS.
 * - `gulp server` - Start the development server and watch files for changes.
 */
exports.build = build;
exports.server = server;
