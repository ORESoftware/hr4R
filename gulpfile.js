
// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');

// JS hint task
gulp.task('jshint', function() {
    gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// JS hint task
gulp.task('build_requirejs_old', function() {
    gulp.src('./src/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build_requirejs_olld', function() {

    var allfiles = require('./public/static/app/js/allFiles.js');

    var fs = require('fs');

    var str1 = fs.readFileSync('./public/static/app/js/requirejsTemplate.txt');

    var str2 = fs.readFileSync('./public/static/app/js/temp1.txt');
    var str3 = String(str1).replace('****',str2);

    var str4 = fs.readFileSync('./public/static/app/js/temp2.txt');
    str3 = str3.replace('$$$$',str4);

    console.log(str3);
    fs.writeFileSync('./public/static/app/js/allControllers.js',str3);

});

gulp.task('build_requirejs', function() {

    var allfiles = require('./public/static/app/js/allFiles.js');

    var fs = require('fs');

    var str1 = fs.readFileSync('./public/static/app/js/requirejsTemplate.txt');

    var str2 = fs.readFileSync('./public/static/app/js/temp1.txt');
    var str3 = String(str1).replace('****',str2);

    var str4 = fs.readFileSync('./public/static/app/js/temp2.txt');
    str3 = str3.replace('$$$$',str4);

    console.log(str3);
    fs.writeFileSync('./public/static/app/js/allControllers.js',str3);

});

// watch for JS changes
//gulp.watch('./src/scripts/*.js', function() {
//    gulp.run('jshint', 'scripts');
//});

gulp.task('default',function(){
    gulp.watch('./public/static/app/js/controllers/**/*.js', function() {
        gulp.run('build_requirejs');
    });

    //gulp.src('./public/static/app/js/controllers/**/*.js').pipe(console.log);
});

