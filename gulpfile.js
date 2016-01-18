var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var server = require( 'gulp-develop-server' );
var jade = require('gulp-jade');

gulp.task('collectFramework', function() {
    gulp.src(['app/client/bower_components/angular/angular.js'])
        .pipe($.concat('framework.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('getAngularUiRouter', function() {
    gulp.src(['app/client/bower_components/angular-ui-router/release/angular-ui-router.js'])
        .pipe($.concat('ui-router.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('collectUserScripts', function() {
    gulp.src(['app/client/scripts/controllers/mainCtrl.js', 'app/client/scripts/controllers/**/*.js', 'app/client/scripts/**/*.js'])
        .pipe($.concat('scripts.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('server:start', function() {
    server.listen({path: 'app.js'});
    gulp.watch( [ './app.js' ], server.restart );
});

gulp.task('convertTemplates', function() {
    var mylocals = {};

    gulp.src('app/client/**/*.jade')
        .pipe(jade({locals: mylocals, pretty: true, doctype: "html"}))
        .pipe(gulp.dest('build'))
});

gulp.task('collectStyles', function() {
    gulp.src('app/client/bower_components/bootstrap/dist/css/bootstrap.css')
        .pipe($.concat('bootstrap.css'))
        .pipe(gulp.dest('build'))
});

gulp.task('build', ['collectFramework', 'getAngularUiRouter', 'collectUserScripts', 'convertTemplates', 'collectStyles']);