(function () {
    'use strict';

    var gulp = require('gulp'),
        sass = require('gulp-sass'),
        rename = require('gulp-rename'),
        livereload = require('gulp-livereload'),
        exec = require('exec'),
        minifyCss = require('gulp-minify-css'),
        browserify = require('browserify'),
        source = require('vinyl-source-stream'),
        path = require('path'),
        o = require('open'),
        ripple = require('ripple-emulator'),

        webPath = function (p) {
            return path.join('./www/', p);
        };

    gulp.task('refresh', function() {
        exec('cordova prepare', function () {
            console.log('Files copied to platform folders');
        });
    });

    // using vinyl-source-stream:
    gulp.task('scripts', function () {
        browserify({
            debug: true
        })
            .add('./www/js/app.js')
            //.transform('debowerify')
            .bundle()
            .pipe(source('app.bundle.js'))
            //.pipe(streamify(uglify()))
            .pipe(gulp.dest(webPath('js/')));
    });

    // Compiles the SASS styles
    gulp.task('sass', function (done) {
        gulp.src('./scss/ionic.app.scss')
            .pipe(sass())
            .pipe(gulp.dest('./www/css/'))
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
            .pipe(rename({ extname: '.min.css' }))
            .pipe(gulp.dest('./www/css/'))
            .on('end', done);
    });

    // The default task
    gulp.task('default', function () {
        var paths = {
                sass: ['./scss/**/*.scss'],
                js: ['./www/js/**/*.js']
            },
            options = {
                keepAlive: false,
                open: true,
                port: 4400
            };

        // Start livereload server
        livereload.listen();

        // Watch the JS directory for changes and re-run scripts task when it changes
        gulp.watch(paths.js, ['scripts', 'refresh']).on('change', livereload.changed);

        // Watch the CSS directory for changes and re-run styles task when it changes
        gulp.watch(paths.sass, ['sass', 'refresh']).on('change', livereload.changed);

        // Run scripts and styles tasks for the first time
        gulp.run('scripts');
        gulp.run('sass');

        // Start the ripple server
        ripple.emulate.start(options);

        if (options.open) {
            o('http://localhost:' + options.port + '?enableripple=cordova-3.0.0');
        }
    });
}());