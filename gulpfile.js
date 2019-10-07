const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      concat = require('gulp-concat'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      babel = require('gulp-babel');
 
// Turning SCSS to CSS + autoprefixing + minifying
gulp.task('sass', () => {
  return gulp.src('assets/stylesheets/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(cleanCSS({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

// Using babel to turn es6 to older js versions
gulp.task('babel', () => {
  return gulp.src('assets/javascripts/main.js')
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(gulp.dest('assets/javascripts/babel'));
});

// Concatenating all the js files
gulp.task('scripts', ['babel'], () => {
  return gulp.src([
    'assets/javascripts/vendor/modernizr-3.6.0.min.js',
    'assets/javascripts/vendor/jquery-3.3.1.min.js',
    'assets/javascripts/vendor/popper.min.js', 
    'assets/javascripts/vendor/bootstrap/util.js',
    'assets/javascripts/vendor/bootstrap/alert.js',
    'assets/javascripts/vendor/bootstrap/button.js',
    'assets/javascripts/vendor/bootstrap/carousel.js',
    'assets/javascripts/vendor/bootstrap/collapse.js',
    'assets/javascripts/vendor/bootstrap/dropdown.js',
    'assets/javascripts/vendor/bootstrap/modal.js',
    'assets/javascripts/vendor/bootstrap/tooltip.js',
    'assets/javascripts/vendor/bootstrap/popover.js',
    'assets/javascripts/vendor/bootstrap/scrollspy.js',
    'assets/javascripts/vendor/bootstrap/tab.js',
    'assets/javascripts/vendor/bootstrap/index.js',
    'assets/javascripts/babel/main.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

// Watch and autoreload the browser
gulp.task('serve', ['sass', 'babel', 'scripts'], () => {

  browserSync.init({
    server: {
      baseDir: "./build",
      directory: true
    },
    ghostMode: false
  });

  gulp.watch('assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch('assets/javascripts/**/*.js', ['babel', 'scripts']);
  gulp.watch("build/*.html").on('change', browserSync.reload);
  gulp.watch("build/img/*.*").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);