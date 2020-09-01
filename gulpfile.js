// Load plugins.
const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const download = require('gulp-download-stream');
const fs = require('fs');
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
const yaml = require('js-yaml');

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
  colorSwatches: [
    {
      src:
        config.patternDirectory + '/00-base/global/01-colors/_color-vars.scss',
      dest: config.patternDirectory + '/00-base/global/01-colors/colors.yml',
      lineStartsWith: '$',
      allowVarValues: false,
    },
  ],
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
  destDirPatterns: 'components/js/patterns',
  destDirOther: 'components/js/other',
};
config.npm = {
  srcFiles: './node_modules/',
};

// BrowserSync.
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: config.patternLab.publicDirectory,
    },
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
  return (
    gulp
      .src([config.js.srcFiles])
      .pipe(plumber())
      // .pipe(uglify())
      .pipe(gulp.dest(config.js.destDirPatterns))
      .pipe(browsersync.stream())
  );
  done();
}

// Clean js assets.
function cleanJS(done) {
  return del([config.js.destDirPatterns]);
  done();
}

// Clean Drupal assets.
function cleanDrupal(done) {
  return del('it-osu-pl-drupal/**/*');
  done();
}

// Generate Pattern Lab task.
function plGenerate(done) {
  return run('php pattern-lab/core/console --generate').exec();
  done();
}

// Generate color swatches.
// Adapted from: https://github.com/fourkitchens/emulsify-gulp.
function colorSwatches(done) {
  config.patternLab.colorSwatches.forEach(
    ({ src, lineStartsWith, allowVarValues, dest }) => {
      const scssVarList = _.filter(
        fs.readFileSync(src, 'utf8').split('\n'),
        (item) => _.startsWith(item, lineStartsWith)
      );

      let varsAndValues = _.map(scssVarList, (item) => {
        const x = item.split(':');
        return {
          name: x[0].trim(), // i.e. $color-gray
          value: x[1].replace(/;.*/, '').trim(), // i.e. hsl(0, 0%, 50%)
        };
      });

      if (!allowVarValues) {
        varsAndValues = _.filter(
          varsAndValues,
          ({ value }) => !_.startsWith(value, '$')
        );
      }
      fs.writeFileSync(
        dest,
        yaml.dump({
          items: varsAndValues,
          meta: {
            description: `To add to these items, use Sass variables that start with <code>${lineStartsWith}</code> in <code>${src}</code>`,
          },
        })
      );
    }
  );
  done();
}

// Watch files.
function watchFiles() {
  gulp.watch(
    config.sass.watchFiles,
    gulp.series(css, colorSwatches, plGenerate)
  );
  gulp.watch(config.js.watchFiles, gulp.series(cleanJS, js, plGenerate));
  gulp.watch(
    config.patternLab.watchFiles,
    gulp.series(plGenerate, browserSyncReload)
  );
}

// Copy certain files from NPM to js directory.
function copyNPM(done) {
  gulp
    .src(config.npm.srcFiles + 'hoverintent/dist/hoverintent.min.js')
    .pipe(gulp.dest(config.js.destDirOther));
  done();
}

// Copy PL site files to build directory.
function copyBuild(done) {
  gulp
    .src(config.patternLab.publicDirectory + '/**/*')
    .pipe(gulp.dest('build'));
  done();
}

// Copy patterns and supporting files to it-osu-pl-drupal directory.
function copyDrupal(done) {
  gulp
    .src([
      config.patternDirectory + '/**/*.twig',
      config.patternDirectory + '/**/*.scss',
    ])
    .pipe(gulp.dest('it-osu-pl-drupal'));
  gulp.src('./components/css/**').pipe(gulp.dest('it-osu-pl-drupal/css'));
  gulp.src('./components/js/**').pipe(gulp.dest('it-osu-pl-drupal/js'));
  gulp.src('./components/images/**').pipe(gulp.dest('it-osu-pl-drupal/images'));
  done();
}

// Create an altered composer.json file for deployment to it-osu-pl-drupal.
function drupalComposer(done) {
  gulp
    .src(['composer.json'])
    .pipe(replace('it-osu-web/it-osu-pl', 'it-osu-web/it-osu-pl-drupal'))
    .pipe(
      replace(
        'IT@OSU Pattern Lab',
        'IT@OSU Pattern Lab assets for use in a Drupal 8/9 theme'
      )
    )
    .pipe(gulp.dest('it-osu-pl-drupal'));
  done();
}

// Request current README from it-osu-pl-drupal.
function requestReadme(done) {
  download(
    'https://raw.githubusercontent.com/it-osu-web/it-osu-pl-drupal/master/README.md'
  ).pipe(gulp.dest('it-osu-pl-drupal'));
  done();
}

// Request current CHANGELOG from it-osu-pl-drupal.
function requestChangelog(done) {
  download(
    'https://raw.githubusercontent.com/it-osu-web/it-osu-pl-drupal/master/CHANGELOG.md'
  ).pipe(gulp.dest('it-osu-pl-drupal'));
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
      message: 'Publish gh-pages: auto-generated commit via gulp.',
    },
    function (err) {
      if (err === undefined) {
        console.log('PL successfully deployed to github!');
      } else {
        console.log(err);
      }
    }
  );
  done();
}

// Publish patterns to the it-osu-web/it-osu-pl-drupal repository.
function drupalPublish(done) {
  ghpages.publish(
    'it-osu-pl-drupal',
    {
      repo: 'https://github.com/it-osu-web/it-osu-pl-drupal.git',
      branch: 'master',
      message: 'Publish drupal: auto-generated commit via gulp.',
    },
    function (err) {
      if (err === undefined) {
        console.log('Patterns successfully deployed to github!');
      } else {
        console.log(err);
      }
    }
  );
  done();
}

// Define grouped tasks.
const watch = gulp.parallel(watchFiles, browserSync);
const start = gulp.series(
  gulp.parallel(css, js),
  plGenerate,
  copyNPM,
  copyBuild,
  copyDrupal,
  watch
);
const buildPages = gulp.series(
  cleanJS,
  gulp.parallel(css, js),
  ghDataAdd,
  plGenerate,
  copyBuild
);
const deployPages = gulp.series(
  ghPagesCache,
  buildPages,
  ghPublish,
  ghDataRemove
);
const buildDrupal = gulp.series(
  cleanJS,
  cleanDrupal,
  gulp.parallel(css, js),
  plGenerate,
  copyDrupal,
  drupalComposer,
  requestChangelog,
  requestReadme
);
const deployDrupal = gulp.series(ghPagesCache, drupalPublish);

// Exports.
exports.deployPages = deployPages;
exports.buildDrupal = buildDrupal;
exports.deployDrupal = deployDrupal;
exports.default = start;
