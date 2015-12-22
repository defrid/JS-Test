var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var server = require( 'gulp-develop-server' );
var jade = require('gulp-jade');

gulp.task('collectFramework', function() {
    gulp.src(['app/client/scripts/framework/Scope.js', 'app/client/scripts/framework/**/*.js'])
        .pipe($.concat('framework.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('collectUserScripts', function() {
    gulp.src(['!app/client/scripts/framework/**/*.js', 'app/client/scripts/**/*.js'])
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
        .pipe(jade({locals: mylocals, pretty: true}))
        .pipe(gulp.dest('build'))
});

gulp.task('build', ['collectFramework', 'collectUserScripts', 'convertTemplates']);