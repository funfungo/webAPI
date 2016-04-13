var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var nano = require('gulp-cssnano');
var postCSS =require('gulp-postcss');
var header = require('gulp-header');
var autoprefixer = require('autoprefixer');
var sourceMap = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var tab = require('gulp-tap');
var pkg = require('./package.json');

console.log(uglify);

var dist = __dirname + '/dist';

gulp.task('build:style', function () {
    var headerStr = [
        "/*  wrynn's webAPI test V${pkg.version}  */",
        ''
    ].join('\n');
    gulp.src('src/style/*.less', {base: 'src'})
        .pipe(sourceMap.init())
        .pipe(less().on('error', function (e) {
            console.log(e.message);
            this.emit('end');
        }))
        .pipe(postCSS([autoprefixer]))
        .pipe(sourceMap.write())
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano())
        .pipe(header(headerStr, {pkg: pkg}))
        .pipe(gulp.dest(dist));
});

gulp.task("build:assets", function () {
    gulp.src('src/images/*.?(png|jpg|gif)', {base: 'src'})
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(dist));
});

gulp.task("build:js", function () {
    gulp.src('src/js/*.js', {base: 'src'})
        .pipe(sourceMap.init())
        .pipe(babel())
        .pipe(sourceMap.write())
        .pipe(browserSync.reload({stream: true}))
        .pipe(uglify())
        .pipe(gulp.dest(dist));
});

gulp.task('build:html', function () {
    gulp.src('src/tmpl/*.html',{base:'src'})
        .pipe(tab(function(file){
            var content = file.contents.toString();
            content = content.replace(/<link.+less/ig, function (match) {
                return match.replace('less','css');
            });
            file.contents = new Buffer(content);
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('build:index',function(){
    var str = '<!DOCTYPE html><html><head><meta charset="UTF-8"> <title>文件目录</title></head><body><ul>'
    var fileList = fs.readdirSync('src/tmpl');
    if(fileList.length) {
        fileList.forEach(function (e,i) {
            str += '<li><a href="./' + e + '">' + e + '</a></li>';
            console.log('<li><a href="./' + e + '">' + e + '</a></li>');
        });
        str += "</ul></body></html>";
        fs.open('./dist/tmpl/index.html', 'w+', function (err,fd) {
            if(err){
                console.log('open err');
                throw err;
            }
            fs.write(fd, str, function (e) {
                if(e) throw e;
                fs.closeSync(fd);
            });
        });
    }
});

gulp.task('build:all', ['build:style','build:js','build:assets','build:html','build:index']);

gulp.task('serve', ['build:index'],function () {
    browserSync.init({
        server:{
            baseDir:'./dist'
        },
        startPath: '/tmpl'
    });
});

gulp.task('watch', function () {
    gulp.watch('src/style/*.less',['build:style']);
    gulp.watch('src/images/*.?(jpg|png|gif)', ['build:assets']);
    gulp.watch('src/js/*.js', ['build:js']);
    gulp.watch('src/tmpl/*.html', ['build:html']);
});

gulp.task('default', function () {
    gulp.start('watch');
    gulp.start('serve');
});


// to do
// 1.监控删除
// 2.文件夹改名
// 3.创建文件夹