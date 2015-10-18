var gulp = require('gulp'),
    data = require('gulp-data'),
    sass = require('gulp-ruby-sass'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    notify = require("gulp-notify"),
    bower = require('gulp-bower')
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components',
    jsConcatFiles: [
        './resources/js/main.js'
    ],
    buildFilesFoldersRemove:[
        'build/scss/',
        'build/js/!(*.min.js)',
        'build/bower.json',
        'build/bower_components/',
        'build/maps/'
    ]
};

/**
 * @param err
 */
function errorLog(err)
{
    console.error(err.message);

    this.emit('end');
}

/**
 * Scripts Tasks
 */
gulp.task(
    'scripts',
    function()
    {
        return gulp
            .src(config.jsConcatFiles)
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .on('error', errorLog)
            .pipe(rename('app.min.js'))
            .pipe(sourcemaps.write('../maps/javascripts/'))
            .pipe(gulp.dest('./public/javascripts/'))
            .pipe(
                reload(
                    {
                        stream: true
                    }
                )
            );
    }
);

/**
 * Start Bower
 */
gulp.task(
    'bower',
    function()
    {
        return bower()
            .pipe(gulp.dest(config.bowerDir))
    }
);

/**
 * Copy general styles to public folder
 */
gulp.task(
    'styles',
    function()
    {
        gulp.src([config.sassPath + '/style.scss'])
            .pipe(sourcemaps.init())
            .pipe(
                autoprefixer(
                    {
                        browsers: ['last 2 versions'],
                        cascade: false
                    }
                )
            )
            .pipe(
                sass(
                    {
                        style: 'compressed',
                        loadPath: './public/stylesheets'
                    }
                )
            )
            .on('error', errorLog)
            .pipe(sourcemaps.write('../maps/stylesheets/'))
            .pipe(gulp.dest('./public/stylesheets'))
            .pipe(
                reload(
                    {
                        stream: true
                    }
                )
            );
    }
);

/**
 * Load bootstrap configuration
 */
gulp.task(
    'bootstrap',
    function()
    {
        return gulp
            .src('./resources/sass/app.scss')
            .pipe(
                sass(
                    {
                        style: 'compressed',
                        loadPath: [
                            config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                            config.bowerDir + '/font-awesome/scss',
                        ]
                    }
                )
            )
            .pipe(gulp.dest('./public/stylesheets'));
    }
);

/**
 * Copy fonts
 */
gulp.task(
    'fonts',
    function()
    {
        return gulp
            .src(config.bowerDir + '/bootstrap-sass/assets/fonts/**/*')
            .pipe(gulp.dest('./public/fonts'));
    }
);

/**
 * Transfer Jade HTML template
 */
gulp.task(
    'html',
    function()
    {
        var YOUR_LOCALS = {};

        gulp
            .src('./views/**/*.jade')
            .pipe(
                data(
                    function(file)
                    {
                        return {};
                    }
                )
            )
            .pipe(
                jade(
                    {
                        locals : YOUR_LOCALS
                    }
                )
            )
            .pipe(gulp.dest('./dist/'))
            .pipe(
                reload(
                    {
                        stream : true
                    }
                )
            );
    }
);

/**
 * Rerun the task when a file changes
 */
gulp.task(
    'browser-sync',
    function()
    {
        browserSync.init(
            {
                ui: {
                    port: 3000
                },
                proxy: "localhost:3000"
            }
        );
    }
);

/**
 * Task to run build server for testing final app
 */
gulp.task(
    'build:serve',
    function()
    {
        browserSync(
            {
                server: {
                    baseDir: "./build/"
                }
            }
        );
    }
);

/**
 * Clean out all files and folders from build folder
 */
gulp.task(
    'build:cleanfolder',
    function (cb)
    {
        del(
            [
                'build/**'
            ],
            cb
        );
    }
);

/**
 * Task to create build directory of all files
 */
gulp.task(
    'build:copy',
    [
        'build:cleanfolder'
    ],
    function()
    {
        return gulp
            .src('app/**/*/')
            .pipe(gulp.dest('build/'));
    }
);

/**
 * Task to removed unwanted build files
 * List all files and directories here that you don't want included
 */
gulp.task(
    'build:remove',
    [
        'build:copy'
    ],
    function (cb)
    {
        del(config.buildFilesFoldersRemove, cb);
    }
);

/**
 * Build task
 */
gulp.task(
    'build',
    [
        'build:copy',
        'build:remove'
    ]
);

/**
 * Watch Tasks
 */
gulp.task(
    'watch',
    function()
    {
        gulp.watch('./resources/sass/**/*.scss', ['styles']);
        gulp.watch('./resources/js/**/*.js', ['scripts']);
        gulp.watch('./views/**/*.jade', ['html']);
    }
);

gulp.task(
    'default',
    [
        'bootstrap',
        'fonts',
        'scripts',
        'styles',
        'html',
        'browser-sync',
        'watch'
    ]
);