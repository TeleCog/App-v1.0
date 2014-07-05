(function () {
    'use strict';

    var gulp = require('gulp'),
        sass = require('gulp-sass'),
        rename = require('gulp-rename'),
        livereload = require('gulp-livereload'),
        jade = require('gulp-jade'),
        exec = require('child_process').execFile,
        gutil = require('gulp-util'),
        minifyCss = require('gulp-minify-css'),
        browserify = require('browserify'),
        source = require('vinyl-source-stream'),
        o = require('open'),
        ripple = require('ripple-emulator');

    gulp.task('refresh', function () {
        exec('./node_modules/cordova/bin/cordova', ['prepare']);
    });

    // Compile Jade Templates
    gulp.task('templates', function () {
        var YOUR_LOCALS = {};

        gulp.src('./app/jade/**/*.jade')
            .pipe(jade({
                locals: YOUR_LOCALS
            }))
            .on('error', gutil.log)
            .on('error', gutil.beep)
            .pipe(gulp.dest('./www/'));
    });

    // using vinyl-source-stream:
    gulp.task('scripts', function () {
        browserify({
            debug: true
        })
            .add('./app/js/app.js')
            //.transform('debowerify')
            .bundle()
            .pipe(source('app.bundle.js'))
            //.pipe(streamify(uglify()))
            .on('error', gutil.log)
            .on('error', gutil.beep)
            .pipe(gulp.dest('./www/js/'));
    });

    // Compiles the SASS styles
    gulp.task('sass', function (done) {
        gulp.src('./app/scss/ionic.app.scss')
            .pipe(sass())
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
            .pipe(rename({ extname: '.min.css' }))
            .on('error', gutil.log)
            .on('error', gutil.beep)
            .pipe(gulp.dest('./www/css/'))
            .on('end', done);
    });

    // Compiles Debug APK
    gulp.task('android', ['refresh'], function () {
        exec('./androidbuild.sh', function (error, stdout, stderr) {
            if (error) {
                console.warn(error);
            }

            if (stderr) {
                console.warn(stderr);
            }

            console.log(stdout);
        });
    });

    // The default task
    gulp.task('default', function () {
        var paths = {
                sass: ['./app/scss/**/*.scss'],
                js: ['./app/js/**/*.js'],
                templates: ['./app/jade/**/*.jade']
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

        // Watch the Templates directory for changes and re-run scripts task when it changes
        gulp.watch(paths.templates, ['templates', 'refresh']).on('change', livereload.changed);

        // Run scripts and styles tasks for the first time
        gulp.run('scripts');
        gulp.run('sass');
        gulp.run('templates');

        // Start the ripple server
        ripple.emulate.start(options);

        if (options.open) {
            o('http://localhost:' + options.port + '?enableripple=cordova-3.0.0');
        }
    });
}());