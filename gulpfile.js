//дефолтные переменные gulp
const { src, dest, watch, parallel, series } = require('gulp');

//объявление переменных пакетов
const sass         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const cssMinify    = require('gulp-css-minify');
const del          = require('del');
const pug          = require('gulp-pug');

//функция live-reload сервера
function browsersync(){
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

//функция очищения папки готового проекта
function cleanDist() {
    return del('dist')
}

//функция сжатия изображений
function images() {
    return src('app/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
                ]
            })
        ]
    ))
    .pipe(dest('dist/images'))
}

//функция минимизации js скриптов
function scripts() {
    return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

// функция pug
function pugConvert() {
    return src('app/*.pug')
    .pipe (pug({pretty: true}))
    .pipe(dest('app/'))
    .pipe(browserSync.stream())
}

//функция минимизации sass файла с добавлением префиксов
function styles() {
    return src('app/sass/style.sass')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

//функция минимизации normalize css файла с добавлением префиксов
function normalize () {
  return src('app/css/*.css')
    .pipe(concat('normalize.min.css'))
    .pipe(cssMinify())
    .pipe(dest('app/css'));
}

//функция сборки готового проекта
function build() {
    return src([
        'app/css/style.min.css',
        'app/css/normalize.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ],  {base: 'app'})
        .pipe(dest('dist'))
}

//функция live изменений
function watching() {
    watch(['app/sass/**/*.sass'], styles)
    watch(['app/*.pug'], pugConvert)
//    watch(['app/css/**/*.css'], normalize)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload);
}

//экспорт функций
exports.styles      = styles;
exports.pugConvert  = pugConvert;
//exports.normalize   = normalize;
exports.watching    = watching;
exports.browsersync = browserSync;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanDist   = cleanDist;

//функция построения готового проекта
exports.build = series(cleanDist, images, build);
//экспорт дефолтной функции "gulp"
exports.default = parallel(scripts, browsersync, watching);

