'use strict';
/** Require dependencies. */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-clean-css'),
    htmlReplace = require('gulp-html-replace'),
    maps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

/** Write .html files to the dist folder. */
gulp.task('html', function() {
    return gulp.src('./*.html') /** create stream from html files */
        .pipe(htmlReplace({
          'css': 'css/style.min.css',
          'js': 'js/all.min.js'
        }))
        .pipe(gulp.dest('./dist')) /** write to dist folder */
        .pipe(connect.reload()); /** use gulp-connect to reload the server */
});

/** Minify scripts. Create sourcemap and write to dist/js folder. */
gulp.task('scripts', function() {
    return gulp.src('js/**/*.js') 
        .pipe(maps.init()) 
        .pipe(concat('all.js')) 
        .pipe(uglify()) 
        .pipe(rename('all.min.js')) 
        .pipe(maps.write('./')) 
        .pipe(gulp.dest('./dist/js')) 
        .pipe(connect.reload()); 
});

/** Compile + minify sass files. Create sourcemap and write to dist/css folder. */
gulp.task('styles', function() {
    return gulp.src([ 
        'css/_colors.scss',
        'css/style.scss'
    ])
        .pipe(maps.init())
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(minifyCss())
        .pipe(rename('style.min.css'))
        .pipe(maps.write('./')) 
        .pipe(gulp.dest('./dist/css')) 
        .pipe(connect.reload()); 
});

/** Optimise + copy images into dist/img */
gulp.task('images', function() {
    return gulp.src(['img/*']) 
        .pipe(imagemin()) 
        .pipe(gulp.dest('dist/img')); 
});
/** Copy favicons into dist folder */
gulp.task('favicons', function(){
  return gulp.src(['./*.ico', './*.png'])
      .pipe(gulp.dest('dist/'));
})

/** Copy data folder into dist folder */
gulp.task('data', function() {
  return gulp.src(['data/*']) 
      .pipe(gulp.dest('dist/data')); 
});


/** Create a web server on port 3000 using gulp-connect */
gulp.task('startServer', function(done) {
    connect.server({
        root: 'dist', 
        port: 3000, 
        livereload: true 
    });
    done();
});

/** Open index.html in the browser with gulp-open. */
gulp.task('open', function(done) {
    gulp.src('dist/index.html')
        .pipe(open({uri: 'http://localhost:3000/'}));  
    done();
});

/** Remove all files and folders inside dist folder, using del package */
gulp.task('clean', function() {
    return del('dist/**/*');
});

/** Watch index.html, and all files in sass and js folders for changes. */
gulp.task('watch', function() {
    gulp.watch('*.html', gulp.series('html')); 
    gulp.watch('css/*', gulp.series('styles')); 
    gulp.watch('js/*', gulp.series('scripts')); 
});

/** Build task. Clean up dist folder, combine and minify sass/js, optimize images, write files to dist folder. */
gulp.task('build', gulp.series('clean', 'html', 'scripts', 'styles', 'images', 'favicons', 'data'));

/** Default task. Run build task first then; create server, open in browser, and watch sass, js and index.html files for changes. */
gulp.task('default', gulp.series('build', 'startServer', 'open', 'watch', function() {
}));