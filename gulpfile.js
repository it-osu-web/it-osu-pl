// Load plugins.
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const ghpages = require('gh-pages');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const run = require('gulp-run');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Configuration.
var config = {};
config.baseDirectory = 'components';
config.patternDirectory = config.baseDirectory + '/_patterns';
config.patternLab = {
  watchFiles: [
    config.patternDirectory + '/**/*.twig',
    config.patternDirectory + '/**/*.md',
    config.patternDirectory + '/**/*.yml',
    config.baseDirectory + '/_data/**/*.yml',
  ],
  publicDirectory: './pattern-lab/public/',
  ghData: 'components/_data/gh-data',
};
config.sass = {
  srcFiles: config.patternDirectory + '/style.scss',
  watchFiles: [
    config.patternDirectory + '/style.scss',
    config.patternDirectory + '/**/*.scss',
  ],
  destDir: 'components/css',
};
config.js = {
  srcFiles: config.patternDirectory + '/**/*.js',
  watchFiles: [config.patternDirectory + '/**/*.js'],
  destDir: 'components/js',
};

// BrowserSync.
function browserSync(done) {
  browsersync.init({
    server: { baseDir: config.patternLab.publicDirectory },
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
  gulp
    .src(config.patternLab.publicDirectory + '/**/*')
    .pipe(gulp.dest('build'));
  done();
}

// Copy patterns and supporting files to drupal directory.
function copyDrupal(done) {
  gulp.src(config.patternDirectory + '/**/*.twig').pipe(gulp.dest('drupal'));
  gulp.src('./components/css/**').pipe(gulp.dest('drupal/css'));
  gulp.src('./components/js/**').pipe(gulp.dest('drupal/js'));
  gulp.src('./components/images/**').pipe(gulp.dest('drupal/images'));
  gulp.src('composer.json').pipe(gulp.dest('drupal'));
  done();
}

// Clear gh-pages cache.
function ghPagesCache(done) {
  return run('rm -rf node_modules/gh-pages/.cache').exec();
  done();
}

// Add _data for gh-pages.
function ghDataAdd(done) {
  gulp
    .src(['components/_data/data.yml'])
    .pipe(replace('base_path:', 'base_path: ../..'))
    .pipe(gulp.dest(config.patternLab.ghData));
  done();
}

// Remove _data for gh-pages.
function ghDataRemove(done) {
  return del([config.patternLab.ghData + '/*']);
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

// Publish patterns to drupal branch to be used in D8 themes.
function drupalPublish(done) {
  ghpages.publish(
    'drupal',
    {
      branch: 'patterns',
      message: 'Publish drupal: auto-generated commit via gulp',
    },
    function(err) {
      if (err === undefined) {
        console.log('Patterns successfully deployed to github!');
      } else {
        console.log(err);
      }
    },
  );
  done();
}

// Define grouped tasks.
const watch = gulp.parallel(watchFiles, browserSync);
const start = gulp.series(
  gulp.parallel(css, js),
  plGenerate,
  copyBuild,
  copyDrupal,
  watch,
);
const buildPages = gulp.series(
  gulp.parallel(css, js),
  ghDataAdd,
  plGenerate,
  copyBuild,
);
const buildPatterns = gulp.series(
  gulp.parallel(css, js),
  plGenerate,
  copyDrupal,
);
const deployPages = gulp.series(
  ghPagesCache,
  buildPages,
  ghPublish,
  ghDataRemove,
);
const deployDrupal = gulp.series(ghPagesCache, buildPatterns, drupalPublish);

// Exports.
exports.deployPages = deployPages;
exports.deployDrupal = deployDrupal;
exports.default = start;
