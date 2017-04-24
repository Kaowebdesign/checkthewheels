var gulp=require('gulp'),
	sass=require('gulp-sass'),
	browserSync=require('browser-sync'),
	concat=require('gulp-concat'),
	uglify=require('gulp-uglifyjs'),
	cssnano=require('gulp-cssnano'),
	rename=require('gulp-rename'),
	del=require('del'),
	imagemin=require('gulp-imagemin'),
	pngquant=require('imagemin-pngquant'),
	cache=require('gulp-cache'),
	autoprefixer=require('gulp-autoprefixer'),
	plumber=require('gulp-plumber'),
	svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	pug=require('gulp-pug');

gulp.task('sass',function(){//Таск для пошуку sass файлів
	return gulp.src('app/sass/**/*.scss')/*Обираємо всі файли з даним розширенням*/
	.pipe(plumber())
    .pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions','> 1%', 'ie 8', 'ie 7'],{cascade:true}))
	.pipe(gulp.dest('app/css'))/*Результат кладемо в папку css*/
	.pipe(browserSync.reload({stream:true}))
});

gulp.task('pug', function () {
	gulp.src('app/pug/*.pug')
	    .pipe(plumber())
	    .pipe(pug({
      				pretty: true
    	}))
	    .pipe(gulp.dest('app/'));
});

gulp.task('browser-sync',function(){
	browserSync({
		server:{
				baseDir:'app'
				},
		notify:false
	});
});

/*SVG-SPRITE START*/
/*
gulp.task('svgSpriteBuild', function () {
	return gulp.src('app/img/svg/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest:'../../../sass/_sprite.scss',
							template: assetsDir + "sass/templates/_sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('app/img/sprites'));
});

gulp.task('svgSprite', ['svgSpriteBuild', 'svgSpriteSass']);
*/
/*SVG-SPRITE END*/

gulp.task('scripts',function(){
	return gulp.src([
		'app/lips/jquery/dist/jquery.min.js',
		'app/lips/magnific-popup/dist/jquery.magnific-popup.min.js',
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
});

gulp.task('css-libs',['sass'],function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest('app/css/'));
});

gulp.task('clean',function(){
	return del.sync('dist');
});

gulp.task('clear',function(){
	return cache.clearAll();
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive:true,
		svgoPlugins:[{removeViewBox:false}],
		use:[pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch',['browser-sync','css-libs','scripts','pug','build'],function(){
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/*.html',browserSync.reload);
	gulp.watch('app/js/**/*.js',browserSync.reload);

});

gulp.task('build',['clean','img','sass','scripts'],function(){

	var buildCss=gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'));

	var buildFonts=gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs=gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml=gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('default',['watch']);