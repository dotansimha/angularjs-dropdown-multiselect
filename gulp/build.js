'use strict';

var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function() {
	return gulp.src([
    path.join(conf.paths.src, conf.paths.template),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
	])
    .pipe($.htmlmin({
    	removeEmptyAttributes: true,
    	removeAttributeQuotes: true,
    	collapseBooleanAttributes: true,
    	collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
    	module: conf.names.module,
    	root: conf.paths.templateRoot,
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function() {
	var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
	var partialsInjectOptions = {
		starttag: '<!-- inject:partials -->',
		ignorePath: path.join(conf.paths.tmp, '/partials'),
		addRootSlash: false
	};

	var htmlFilter = $.filter('*.html', { restore: true });
	var jsFilter = $.filter('**/*.js', { restore: true });
	var cssFilter = $.filter('**/*.css', { restore: true });

	return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    // .pipe($.sourcemaps.init())
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.cssnano())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(htmlFilter)
    .pipe($.htmlmin({
    	removeEmptyAttributes: true,
    	removeAttributeQuotes: true,
    	collapseBooleanAttributes: true,
    	collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function() {
	return gulp.src($.mainBowerFiles({
		paths: {
			bowerJson: 'bowerDocs.json'
		}
	}))
    .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function() {
	var fileFilter = $.filter(function(file) {
		return file.stat.isFile();
	});

	return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
	])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function() {
	return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', ['html', 'fonts', 'other']);

gulp.task('conf:component', function(cb) {
	conf.paths.src = 'src/app/component';
	conf.paths.dist = 'dist';
	conf.paths.template = '**/*.html';
	conf.paths.index = 'angularjs-dropdown-multiselect.module.js';
	conf.paths.templateRoot = 'app/component/';
	conf.paths.cssRoot = '';
	conf.paths.bowerJson = '../bower.json';
	conf.names.module = 'angularjs-dropdown-multiselect';
	conf.wiredep.bowerJson = require(conf.paths.bowerJson);
	cb();
});

gulp.task('clean:component', ['conf:component'], function() {
	return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('compile:component', ['clean:component'], function(cb) {
	runSequence(['scripts', 'styles', 'partials'], cb);
});

gulp.task('build.component.minified', ['compile:component'], function () {
	var jsFilter = $.filter('**/*.js', { restore: true });
	var cssFilter = $.filter('**/*.css', { restore: true });

	return gulp.src([
		path.join(conf.paths.tmp, 'serve/app/index.css'),
		path.join(conf.paths.tmp, 'serve/app/index.module.js'),
		path.join(conf.paths.tmp, 'partials/templateCacheHtml.js')
	])
		.pipe(jsFilter)
		.pipe(concat({ path: 'angularjs-dropdown-multiselect.min.js' }))
		.pipe($.sourcemaps.init())
		.pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
		.pipe($.sourcemaps.write('maps'))
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe($.cssnano())
		.pipe(cssFilter.restore)
		.pipe(gulp.dest(path.join(conf.paths.dist, '/')))
		.pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

gulp.task('build.component', ['compile:component'], function () {
	var jsFilter = $.filter('**/*.js', { restore: true });
	var cssFilter = $.filter('**/*.css', { restore: true });

	return gulp.src([
		path.join(conf.paths.tmp, 'serve/app/index.css'),
		path.join(conf.paths.tmp, 'serve/app/index.module.js'),
		path.join(conf.paths.tmp, 'partials/templateCacheHtml.js')
	])
		.pipe(jsFilter)
		.pipe(concat({ path: 'angularjs-dropdown-multiselect.js' }))
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe($.cssnano())
		.pipe(cssFilter.restore)
		.pipe(gulp.dest(path.join(conf.paths.dist, '/src')))
		.pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

gulp.task('build:component', ['build.component.minified', 'build.component']);
