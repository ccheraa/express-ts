process.env.FORCE_COLOR = true;
var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var tslint = require('gulp-tslint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var remap = require('remap-istanbul/lib/gulpRemapIstanbul');
var empty = require('gulp-empty');
var cmd = require('gulp-run');
var clean = require('gulp-clean');
var mincss = require('gulp-clean-css');
var minjs = require('gulp-uglify');
var minhtml = require('gulp-htmlmin');

var bs = require('browser-sync').create();

var project = [
	'src/**/*.ts',
	'!src/**/*.spec.ts'
];
var projectBuild = [
	'output/build/**/*.js',
	'!output/build/**/*.spec.js'
];
var test = [
	'src/**/*.spec.ts'
];
var testBuild = [
	'output/build/**/*.spec.js'
];
var all = [
	'src/**/*.ts',
];
var allBuild = [
	'output/build/**/*.js'
];

gulp.task('cls', function() {
	var lines = process.stdout.getWindowSize()[1];
	for(var i = 0; i < lines; i++) {
		console.log('\r\n');
	}
	return gulp.src('gulpfile.js', {read: false}).pipe(empty());
});
function server(production) {
	return function (cb) {
		var started = false;
		var script = 'output/build/app/app.js';
		if (production) {
			script = 'app.js';
			process.chdir('output/dist');
		}
		return nodemon({script})
			.on('start', function () {
				// to avoid nodemon being started multiple times
				// thanks @matthisk
				if (!started) {
					cb();
					started = true;
				}
			})
			.on('restart', () => {
				bs.reload();
			});
	}
}
gulp.task('server', server());
gulp.task('server-p', server(true));

gulp.task('t', function() {
	console.log(src);
	console.log(dst);
	return gulp.src('gulpfile.js', {read: false}).pipe(empty());
});
gulp.task('bs', ['server'], function() {
	function port(value, def) {
		if (value) {
			if (value.substr(0,2) == '--') {
				value = Number.parseInt(value.substr(2));
			}
		}
		if (!value || Number.isNaN(value)) {
			value = def;
		}
		return value;
	}
	var src = port(process.argv[3], 8001);
	var dst = port(process.argv[4], 3000);
	var ui = port(process.argv[5], 3001);
	return bs.init({
		open: false,
		port: dst,
		ui: { port: ui },
		proxy: 'localhost:' + src
	});
});
gulp.task('dev', ['bs', 'server'], function() {
	return gulp.watch("public/**/*").on('change', bs.reload);
});

gulp.task('lint', function() {
	return gulp.src(project)
	.pipe(tslint({
		formatter: 'verbose'
	}))
	.pipe(tslint.report({
		summarizeFailureOutput: true
	})).once('end', () => {
		gutil.log(gutil.colors.green('No errors!'));
	});
});
gulp.task('build-clean', function(cb) {
	return gulp.src('output/build', {read: false})
  	.pipe(clean());
});
gulp.task('build', ['build-clean'], function(cb) {
  return cmd('tsc').exec();
});
gulp.task('public-clean', function(cb) {
	return gulp.src('output/dist', {read: false})
  	.pipe(clean());
});
gulp.task('min-html', ['public-clean'], function(cb) {
	return gulp.src(['public/**/*.html'])
		.pipe(minhtml({collapseWhitespace: true}))
  	.pipe(gulp.dest('output/dist/public'));
});
gulp.task('min-css', ['min-html'], function(cb) {
	return gulp.src(['public/**/*.css'])
		.pipe(mincss({compatibility: 'ie8'}))
  	.pipe(gulp.dest('output/dist/public'));
});
gulp.task('min-js', ['min-css'], function(cb) {
	return gulp.src(['public/**/*.js'])
		.pipe(minjs())
  	.pipe(gulp.dest('output/dist/public'));
});
gulp.task('public-prepare', ['min-js'], function(cb) {
	return gulp.src(['public/**/*', '!public/**/*.html', '!public/**/*.css', '!public/**/*.js'])
  	.pipe(gulp.dest('output/dist/public'));
});
gulp.task('build-p', ['public-prepare'], function(cb) {
  return cmd('webpack').exec();
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
gulp.task('cover-clean', function(cb) {
	return gulp.src('output/coverage', {read: false})
  	.pipe(clean());
});
gulp.task('pre-cover', ['cover-clean'], function () {
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