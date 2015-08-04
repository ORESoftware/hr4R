//https://github.com/gulpjs/gulp/issues/1186


var gulp = require('gulp');
var path = require('path');

// include plug-ins
var jshint = require('gulp-jshint');

var replaceStream = require('replacestream');
var replace = require('gulp-replace');
var source  = require('vinyl-source-stream');

var fs = require('fs');
var fse = require('fs-extra');


// JS hint task
gulp.task('jshint', function () {
    gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// JS hint task
gulp.task('build_requirejs_old', function () {
    gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('build_requirejs', function () {

    require('./public/static/app/js/allFiles.js')('./public/static/app/js/controllers', 'app/js/');

    var fs = require('fs');

    var str1 = fs.readFileSync('./public/static/app/js/helperStuff/requirejsTemplate.txt');

    var str2 = fs.readFileSync('./public/static/app/js/temp1.txt');
    var str3 = String(str1).replace('****', str2);

    var str4 = fs.readFileSync('./public/static/app/js/temp2.txt');
    str3 = str3.replace('$$$$', str4);

    console.log(str3);
    fs.writeFileSync('./public/static/app/js/allControllers.js', str3);

});

gulp.task('build_requirejs_pipe', function () {

    var str = require('./public/static/app/js/allFiles.js')('./public/static/app/js/controllers', 'app/js/');

    var stars = str.split(';')[0];
    var dollars = str.split(';')[1];


    fs.createReadStream(path.resolve('./public/static/app/js/helperStuff/requirejsTemplate.txt'))
        .pipe(
        replaceStream('****', stars))
        .pipe(
        replaceStream('$$$$', dollars))
        .pipe(
        fse.createOutputStream('./public/static/app/js/meta/allControllers.js')
    );

});


gulp.task('default', function () {

    gulp.run('build_requirejs_pipe');

    gulp.watch('public/static/app/js/controllers/**/*.js', function () {
        gulp.run('build_requirejs_pipe');
    });

    //gulp.watch('./public/static/app/js/controllers/**/*.js', ['build_requirejs_pipe']);

    //gulp.watch('./public/static/app/js/views/**/*.js', function() {
    //    gulp.run('build_views');
    //});


    //gulp.src('./public/static/app/js/controllers/**/*.js').pipe(console.log);
});

