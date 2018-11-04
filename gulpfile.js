var gulp        = require('gulp');
require('es6-promise').polyfill();
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var imagemin = require('gulp-imagemin');
var tinypng = require('gulp-tinypng');
var imageOptim = require('gulp-imageoptim');
var concat = require('gulp-concat');
//var notify          = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserify  = require('gulp-browserify');
var uglify      = require('gulp-uglify');

/*Bournemouth
npm install --save-dev gulp browser-sync gulp-sass gulp-autoprefixer gulp-imagemin gulp-plumber
*/
var messages = {
    htmlRefresh: '<span style="color: grey">Refresing:</span> html'
};

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('html',function() {
   browserSync.notify(messages.htmlRefresh);
   //return gulp.src('index.html').pipe(gulp.dest('_site')).pipe(browserSync.reload({strem:true}));
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync',['sass'], function() {
    browserSync({
        server:{
            baseDir: './'
        }
    });
});

/**
 * Compress images
 */
gulp.task('img', function() {
  gulp.src('**/*.{jpg,gif}')
    .pipe(imagemin({
      optimizationLevel: 7,
      progressive: true
    }))
    .pipe(gulp.dest('compressed_images'))
});

gulp.task('images',['tinypng'], function() {
    return gulp.src('projects/maraton/images/*.{jpg,gif}')
        .pipe(imageOptim.optimize())
        .pipe(gulp.dest('compressed_images'));
});

gulp.task('tinypng', function () {
    gulp.src('projects/maraton/images/*.png')
        .pipe(tinypng('rQ59GPnlxM6QQo0Q_Fb4KDi97umt2Gg8'))
        .pipe(gulp.dest('compressed_images'));
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss',{ sourcemap: true, style: 'compact'})
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true, match: '**/*.css'}));
 /*       .pipe(gulp.dest('css'))
        .pipe(notify('<%= file.relative %>'))
        .pipe(notify({message: 'Css created', onLast: true}));*/
});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('js/*js').pipe(browserSync.reload({stream:true}));
       /* .pipe(concat('concat.js'))
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('/fjs'));*/
});
gulp.task('js-watch',['js'], browserSync.reload);

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch',function(){
    gulp.watch(['_scss/**'],['sass']);
    gulp.watch('js/*.js',['js-watch']);
    gulp.watch(['index.html','projects/*.html'],['html']);
	//gulp.watch('img/src/*.{png,jpg,gif}', ['img']);
})


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files. 'img'
 */
gulp.task('default', ['browser-sync', 'watch']);

/**
 * Optimize Images
 *  
gulp.task('img', function() {
 
  gulp.src('img/src/*.{png,jpg,gif}')
 
    .pipe(imagemin({
 
      optimizationLevel: 7,
 
      progressive: true
 
    }))
 
    .pipe(gulp.dest('img'))
 
});
 */
 
/**
 * Copy files and folder to server
 * via rsync

rsync: {
  src: production + '/**',
  options: {
    destination: '~/path/to/my/website/root/',
    root: production,
    hostname: 'mydomain.com',
    username: 'user',
    incremental: true,
    progress: true,
    relative: true,
    emptyDirectories: true,
    recursive: true,
    clean: true,
    exclude: ['.DS_Store'],
    include: []
  }
}

var rsync  = require('gulp-rsync');
var config = rsync;


gulp.task('rsync', function() {
  return gulp.src(config.src)
    .pipe(rsync(config.options));
});
 */