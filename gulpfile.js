var gulp = require('gulp'),
  watch = require('gulp-watch'),
  browserSync = require("browser-sync"),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),

  jade = require('gulp-jade'),
  rigger = require('gulp-rigger'),
  cleancss = require('gulp-clean-css'),
  notify = require("gulp-notify"),
  cache = require('gulp-cached'),
  compass = require('gulp-compass'),
  cmq = require('gulp-merge-media-queries'),
  base64 = require('gulp-base64'),
  reload = browserSync.reload,
  sourcemaps = require('gulp-sourcemaps');

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/i/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/*.jade',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/i/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.jade',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/i/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "Building::"
};

gulp.task('html:build', function () {
  var YOUR_LOCALS = {};
  gulp.src(path.src.html)
    .pipe(cache('jading...'))
    .pipe(jade({locals: YOUR_LOCALS, pretty: true}))
    .on('error', notify.onError(function (err) {
      return {
        title: 'Jade',
        message: err.message
      };
    }))
    .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
    .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
  gulp.src(path.src.js) //Найдем наш main файл
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
    .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(rigger())
    .pipe(sass({}))
    .on('error', notify.onError(function (err) {
      return {
        title: 'SCSS',
        message: err.message
      };
    }))
    .pipe(prefixer({
      browsers: ['last 2 versions', '> 1%']
    }))
   // .pipe(base64({
   //   extensions: ['svg'],
   //   debug: true
   // }))
   // .pipe(cmq())
   // .pipe(cleancss())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function () {
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function (event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.fonts], function (event, cb) {
    gulp.start('fonts:build');
  });
  watch([path.watch.img], function (event, cb) {
    gulp.start('image:build');
  });
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);