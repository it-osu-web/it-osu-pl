// Load plugins.
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const ghpages = require('gh-pages');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const run = require('gulp-run');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Configuration.
var config = {};
config.baseDirectory = 'components/_patterns';
config.patternLab = {
  watchFiles: [
    config.baseDirectory + '/**/*.twig',
    config.baseDirectory + '/**/*.md',
    config.baseDirectory + '/**/*.yml',
  ],
};
config.sass = {
  srcFiles: config.baseDirectory + '/style.scss',
  watchFiles: [
    config.baseDirectory + '/style.scss',
    config.baseDirectory + '/**/*.scss',
  ],
  destDir: 'components/css',
};
config.js = {
  srcFiles: config.baseDirectory + '/**/*.js',
  watchFiles: [config.baseDirectory + '/**/*.js'],
  destDir: 'components/js',
};

// BrowserSync.
function browserSync(done) {
  browsersync.init({
    server: { baseDir: './pattern-lab/public/' },
  });
  done();
}

// BrowserSync Reload.
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// CSS task.
function css(done) {
  return gulp
    .src(config.sass.srcFiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.sass.destDir))
    .pipe(browsersync.stream());
  done();
}

// JS task.
function js(done) {
  return gulp
    .src([config.js.srcFiles])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(config.js.destDir))
    .pipe(browsersync.stream());
  done();
}

// Clean assets (js only for now).
function clean(done) {
  return del([config.js.destDir + '/*']);
  done();
}

// Generate Pattern Lab task.
function plGenerate(done) {
  return run('php pattern-lab/core/console --generate').exec();
  done();
}

// Watch files.
function watchFiles() {
  gulp.watch(config.sass.watchFiles, gulp.series(css, plGenerate));
  gulp.watch(config.js.watchFiles, gulp.series(clean, js, plGenerate));
  gulp.watch(
    config.patternLab.watchFiles,
    gulp.series(plGenerate, browserSyncReload),
  );
}

// Copy PL site files to build directory.
function copyBuild(done) {
  gulp.src('./pattern-lab/public/**/*').pipe(gulp.dest('build'));
  done();
}

// Clear gh-pages cache.
function ghPagesCache(done) {
  return run('rm -rf node_modules/gh-pages/.cache').exec();
  done();
}

// Publish compiled PL to gh-pages branch.
function ghPublish(done) {
  ghpages.publish(
    'build',
    {
      message: 'Publish gh-pages: auto-generated commit via gulp',
    },
    function(err) {
      if (err === undefined) {
        console.log('PL successfully deployed to github!');
      } else {
        console.log(err);
      }
    },
  );
  done();
}

// Define grouped tasks.
const watch = gulp.parallel(watchFiles, browserSync);
const start = gulp.series(gulp.parallel(css, js), plGenerate, copyBuild, watch);
const build = gulp.series(gulp.parallel(css, js), plGenerate, copyBuild);
const deployPages = gulp.series(ghPagesCache, build, ghPublish);

// Exports.
exports.deployPages = deployPages;
exports.default = start;
