var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var server = require( 'gulp-develop-server' );
var jade = require('gulp-jade');

gulp.task('collectScripts', function() {
    gulp.src('app/client/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.concat('scripts.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('server:start', function() {
    server.listen({path: 'app.js'});
    gulp.watch( [ './app.js' ], server.restart );
});

gulp.task('convertTemplates', function() {
    var mylocals = {};

    gulp.src('app/client/index.jade')
        .pipe(jade({locals: mylocals}))
        .pipe(gulp.dest('build'))
});

gulp.task('build', ['collectScripts', 'convertTemplates']);