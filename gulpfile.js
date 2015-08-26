//https://github.com/gulpjs/gulp/issues/1186


var gulp = require('gulp');
var path = require('path');

//var gulp = require('gulp-param')(require('gulp'), process.argv);

// include plug-ins
var jshint = require('gulp-jshint');

var replaceStream = require('replacestream');
var replace = require('gulp-replace');
var source  = require('vinyl-source-stream');

var fs = require('fs');
var fse = require('fs-extra');

var grm = require('gulp-requirejs-metagen');


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

gulp.task('build_requirejs_pipe_controllers', function () {

    var str = require('./public/static/app/js/allFiles.js')('./public/static/app/js/controllers', 'app/js/');

    var stars = str.split(';')[0];
    var dollars = str.split(';')[1];


    fs.createReadStream(path.resolve('./public/static/app/js/meta/requirejsTemplate.txt'))
        .pipe(
        replaceStream('****', stars))
        .pipe(
        replaceStream('$$$$', dollars))
        .pipe(
        fse.createOutputStream('./public/static/app/js/meta/allControllers.js')
    );

});

gulp.task('build_requirejs_pipe_views', function () {

    var str = require('./public/static/app/js/allFiles.js')('./public/static/app/js/views/relViews', 'jsx!app/js/views/');

    var stars = str.split(';')[0];
    var dollars = str.split(';')[1];


    fs.createReadStream(path.resolve('./public/static/app/js/meta/requirejsTemplate.txt'))
        .pipe(
        replaceStream('****', stars))
        .pipe(
        replaceStream('$$$$', dollars))
        .pipe(
        fse.createOutputStream('./public/static/app/js/meta/allRelViews.js')
    );

});


/*

gulp.task('bbb1', function (cb) {
 grm('../testData/one',
 'jsx!app/js/views/',
 '',
 true,
 '../testResults/test_one_results.js',
 function () {
 cb();
 })
 });

 var opts = {
 inputFolder: '../testData/one',
 appendThisToDependencies: 'jsx!app/js/views/',
 appendThisToReturnedItems: 'dude-',
 eliminateSharedFolder: true,
 output: '../testResults/test_one_results.js'
 };

 */

gulp.task('bbb1',function(cb){
    grm('./public/static/app/js/views/relViews', 'jsx!app/js/views/', '',false,'./public/static/app/js/meta/allRelViews.js', function(){
        cb();
    })
});

gulp.task('bbb2',function(cb){
    grm('./public/static/app/js/controllers', 'app/js/','',false,'./public/static/app/js/meta/allControllers.js', function(){
        cb();
    })
});

//gulp.task('bbb3',function(cb){
//    grm('./public/static/cssx', 'css!','./public/static/app/js/meta/allCSS.js', function(){
//        cb();
//    })
//});

gulp.task('bbb3',function(cb){
    grm('./public/static/cssx', 'text!','',false,'./public/static/app/js/meta/allCSS.js', function(){
        cb();
    })
});

//gulp.task('bbb4',function(cb){
//    grm('./public/static/app/js/flux/dispatchers', 'app/js/flux/','',false,'./public/static/app/js/meta/allDispatchers.js', function(){
//        cb();
//    })
//});

gulp.task('bbb5',function(cb){
    grm('./public/static/app/js/flux/constants', 'app/js/flux/','',false,'./public/static/app/js/meta/allFluxConstants.js', function(){
        cb();
    })
});

gulp.task('bbb6',function(cb){
    grm('./public/static/app/js/views/reactComponents', 'jsx!app/js/views/','',false,'./public/static/app/js/meta/allReactComponents.js', function(){
        cb();
    })
});

gulp.task('bbb7',function(cb){
    grm('./public/static/app/templates', 'text!app/','',false,'./public/static/app/js/meta/allTemplates.js', function(){
        cb();
    })
});

gulp.task('bbb8',function(cb){
    grm('./public/static/app/js/flux/actions', 'app/js/flux/','',false,'./public/static/app/js/meta/allFluxActions.js', function(){
        cb();
    })
});


gulp.task('default', function () {

    gulp.run('bbb1', function(){
       console.log('done with bbb task');
    });

    gulp.run('bbb2', function(){
        console.log('done with bbb2 task');
    });

    gulp.run('bbb3', function(){
        console.log('done with bbb3 task');
    });

    //gulp.run('bbb4', function(){
    //    console.log('done with bbb4 task');
    //});

    gulp.run('bbb5', function(){
        console.log('done with bbb5 task');
    });

    gulp.run('bbb6', function(){
        console.log('done with bbb6 task');
    });

    gulp.run('bbb7', function(){
        console.log('done with bbb7 task');
    });

    gulp.run('bbb8', function(){
        console.log('done with bbb8 task');
    });


    /* gulp.run('build_requirejs_pipe_controllers');
     gulp.run('build_requirejs_pipe_views');

     gulp.watch('public/static/app/js/controllers/!**!/!*.js', function () {
         gulp.run('build_requirejs_pipe_controllers');
     });

     gulp.watch('public/static/app/js/views/relViews/!**!/!*.js', function () {
         gulp.run('build_requirejs_pipe_views');
     });*/

    //gulp.watch('./public/static/app/js/controllers/**/*.js', ['build_requirejs_pipe']);

    //gulp.watch('./public/static/app/js/views/**/*.js', function() {
    //    gulp.run('build_views');
    //});


    //gulp.src('./public/static/app/js/controllers/**/*.js').pipe(console.log);
});

