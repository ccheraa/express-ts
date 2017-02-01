var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var tslint = require('gulp-tslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var remap = require('remap-istanbul/lib/gulpRemapIstanbul');
var empty = require('gulp-empty');
var cmd = require('gulp-run');

var project = [
	"src/**/*.ts",
	"!src/**/*.spec.ts"
];
var projectBuild = [
	"output/build/**/*.js",
	"!output/build/**/*.spec.js"
];
var test = [
	"src/**/*.spec.ts"
];
var testBuild = [
	"output/build/**/*.spec.js"
];
var all = [
	"src/**/*.ts",
];
var allBuild = [
	"output/build/**/*.js"
];

gulp.task("cls", function() {
	var lines = process.stdout.getWindowSize()[1];
	for(var i = 0; i < lines; i++) {
		console.log('\r\n');
	}
	return gulp.src('gulpfile.js', {read: false}).pipe(empty());
});
function server(production) {
	return function (cb) {
		var started = false;
		return nodemon({
			script: 'output/' + (production ? 'dist' : 'build/app') + '/app.js'
		}).on('start', function () {
			// to avoid nodemon being started multiple times
			// thanks @matthisk
			if (!started) {
				cb();
				started = true;
			}
		});
	}
}
gulp.task('server', server());
gulp.task('server-p', server(true));
gulp.task("lint", function() {
	return gulp.src(project)
	.pipe(tslint({
		formatter: "verbose"
	}))
	.pipe(tslint.report({
		summarizeFailureOutput: true
	})).once('end', () => {
		gutil.log(gutil.colors.green('No errors!'));
	});
});
gulp.task("build-p", function(cb) {
  process.env.FORCE_COLOR = true;
  return cmd('webpack').exec()
  	.pipe(gulp.dest('output'));
});
gulp.task('test', function () {
	return gulp.src(testBuild)
		.pipe(mocha())
			.once('end', () => {})
			.once('error', () => {});
});
gulp.task('test-w', ['cls', 'test'], function () {
	return gulp.watch([projectBuild, testBuild], ['cls', 'test']);
});
gulp.task('pre-cover', function () {
	return gulp.src(allBuild)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});
gulp.task('jscover', ['pre-cover'], function () {
	return gulp.src(testBuild)
		.pipe(mocha())
		.pipe(istanbul.writeReports({dir: 'output/coverage/'}));
});
gulp.task('cover', ['jscover'], function () {
	return gulp.src('output/coverage/coverage-final.json')
		.pipe(remap({
			reports: {
				'json': 'output/coverage/coverage-final-ts.json',
				'html': 'output/coverage/lcov-report-ts'
			}
		}))
			.once('error', () => process.exit(1))
			.once('end', () => process.exit());
});
gulp.task('default', ['server'], function () {});