(function () {
    'use strict';

    var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    jade = require('gulp-jade'),
    exec = require('child_process').execFile,
    gutil = require('gulp-util'),
    templateCache = require('gulp-angular-templatecache'),
    minifyCss = require('gulp-minify-css'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    o = require('open'),
    fs = require('fs'),
    ripple = require('ripple-emulator'),
    runSequence = require('run-sequence'),
    exorcist = require('exorcist'),
    UglifyJS = require("uglify-js");

    gulp.task('refresh', function () {
        exec('./node_modules/cordova/bin/cordova', ['prepare']);
    });

    // Compile Jade Templates
    gulp.task('templates', function () {
        var YOUR_LOCALS = {};

        return gulp.src('./app/jade/**/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest('./www/'))
        .pipe(templateCache('templates.js', {
            module: 'templatescache',
            standalone: true
        }))
        .pipe(gulp.dest('./www/js'));
    });

    // using vinyl-source-stream:
    gulp.task('scripts', function () {
        return browserify()
        .add('./www/js/templates.js')
        .add('./app/js/app.js')
        .transform('debowerify')
        .bundle({
            debug: true
        })
        .pipe(exorcist('./www/js/app.bundle.map'))
        .pipe(source('app.bundle.js'))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest('./www/js/'));
    });

    gulp.task('uglify', function () {
        var result = UglifyJS.minify([ './www/js/app.bundle.js' ], {
            inSourceMap: './www/js/app.bundle.map',
            outSourceMap: 'app.bundle.map',
            mangle: false
        });
        /*jslint stupid: true */
        fs.writeFileSync('./www/js/app.bundle.js', result.code);
        fs.writeFileSync('./www/js/app.bundle.map', result.map);

        return gulp.src('./www/js/app.bundle.js');
    });

    // Compiles the SASS styles
    gulp.task('sass', function () {
        return gulp.src('./app/scss/ionic.app.scss')
        .pipe(sass())
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .on('error', gutil.log)
        .on('error', gutil.beep)
        .pipe(gulp.dest('./www/css/'));
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

        runSequence(['templates', 'sass'], 'scripts', 'uglify', 'refresh');

        // Start livereload server
        livereload.listen();

        // Watch the JS directory for changes and re-run scripts task when it changes
        gulp.watch(paths.js, function () {
            runSequence('scripts',
                        'uglify',
                        'refresh',
                        livereload.changed);
        });

        // Watch the CSS directory for changes and re-run styles task when it changes
        gulp.watch(paths.sass, function () {
            runSequence('sass',
                        'refresh',
                        livereload.changed);
        });

        // Watch the Templates directory for changes and re-run scripts task when it changes
        // Scripts depends on templates (semi-hack to get templates to run before scripts
        gulp.watch(paths.templates, function () {
            runSequence('templates',
                        'scripts',
                        'uglify',
                        'refresh',
                        livereload.changed);
        });

        // Start the ripple server
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        ripple.emulate.start(options);

        if (options.open) {
            o('http://localhost:' + options.port + '?enableripple=cordova-3.0.0');
        }
    });
}());
