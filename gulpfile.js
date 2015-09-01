//https://github.com/gulpjs/gulp/issues/1186
//https://medium.com/@webprolific/getting-gulpy-a2010c13d3d5

//core
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var async = require('async');
var _ = require('underscore');


//plugins
var jshint = require('gulp-jshint');
var replaceStream = require('replacestream');
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');

//misc
var fse = require('fs-extra');
var grm = require('gulp-requirejs-metagen');


var io = socketio.listen('3002', function (err, msg) {
    if (err) {
        console.error(err);
    }
    console.log(msg);
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

/*
Gulp uses vinyl-fs, from which it inherits the gulp.src() and gulp.dest() methods.
Vinyl-fs uses the vinyl file object, its “virtual file format”.
*/


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




gulp.task('[metagen] css', function () {

    //cb = _.once(cb);

    var filepath = './public/static/cssx';

    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        meta();
    });

    function meta(){
        grm(filepath, 'text!', '', false, './public/static/app/js/meta/allCSS.js', function () {
            //cb();
        })
    }

    meta();

});



gulp.task('[metagen] flux-constants', function () {

    //cb = _.once(cb);

    var filepath = './public/static/app/js/flux/constants';

    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        meta();
    });


    function meta(){
        grm(filepath, 'app/js/flux/', '', false, './public/static/app/js/meta/allFluxConstants.js', function () {
            //cb();
        })
    }

    meta();

});


gulp.task('[metagen] flux-actions', function () {

    //cb = _.once(cb);

    var filepath = './public/static/app/js/flux/actions';


    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        meta();
    });


    function meta(){
        grm(filepath, 'app/js/flux/', '', false, './public/static/app/js/meta/allFluxActions.js', function () {
            //cb();
        })
    }



    meta();

});


gulp.task('[metagen] react-components', function () {

    //cb = _.once(cb);

    var filepath = './public/static/app/js/views/reactComponents';

    function meta(){
        grm(filepath, 'jsx!app/js/views/', '', false, './public/static/app/js/meta/allReactComponents.js', function () {
            //cb();
        })
    }

    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        meta();
    });

    meta();

});



gulp.task('[metagen] relative-views', function () {

    //cb = _.once(cb);

    var filepath = './public/static/app/js/views/relViews';

    function meta(){
        grm(filepath, 'jsx!app/js/views/', '', false, './public/static/app/js/meta/allRelViews.js', function () {
            //cb();
        })
    }

    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        meta();
    });

    meta();

});



gulp.task('[metagen] controllers', function () {

    //cb = _.once(cb);

    var filepath = './public/static/app/js/controllers';

    function meta(){
        grm(filepath, 'app/js/', '', false, './public/static/app/js/meta/allControllers.js', function () {
            //cb();
        })
    }

    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        meta();
    });

    meta();

});



//gulp.task('[metagen] templates', function (cb) {
//
//    //cb = _.once(cb);
//
//    var filepath = './public/static/app/templates';
//
//    function meta(){
//        grm(filepath, 'text!app/', '', false, './public/static/app/js/meta/allTemplates.js', function (err,msg) {
//            cb(err,msg);
//        })
//    }
//    gulp.watch(filepath+'/**/*.*').on('change',function(file){
//        meta();
//    });
//
//    meta();
//
//});

gulp.task('watch',function(){

    var filepath = './public/static/app/templates';

    function meta(){
        grm(filepath, 'text!app/', '', false, './public/static/app/js/meta/allTemplates.js', function (err,msg) {
            //cb(err,msg);
        })
    }
    gulp.watch(filepath+'/**/*.*').on('change',function(file){
        console.log('changes to templates!');
        meta();
    });

    meta();
});




gulp.task('[watch] hot-reload', function () {


    gulp.watch('./public/static/**/*.ejs').on('change', function (file) {

        var folderz = String(file.path).split(path.sep);
        var folds = [];

        var add = false;
        var prev = null;
        folderz.forEach(function (folder, index) {
            if (add === true) {
                folds.push(folder);
            }
            if (folder === 'static' && prev === 'public') {
                add = true;
            }
            prev = folder;
        });

        var reconciledPath = folds.join(path.sep);
        reconciledPath = 'text!' + reconciledPath;

        io.sockets.emit('hot-reload (.ejs)', reconciledPath);
    });

    gulp.watch('./public/static/app/js/views/**/*.js').on('change', function (file) {

        var folderz = String(file.path).split(path.sep);
        var folds = [];

        var add = false;
        var prev = null;
        folderz.forEach(function (folder, index) {
            if (add === true) {
                folds.push(folder);
            }
            if (folder === 'static' && prev === 'public') {
                add = true;
            }
            prev = folder;
        });

        var reconciledPath = folds.join(path.sep);
        //reconciledPath = 'jsx!'+ reconciledPath.substring(0,reconciledPath.length-3);
        reconciledPath = reconciledPath.substring(0, reconciledPath.length - 3);

        io.sockets.emit('hot-reload (.js)', reconciledPath);
    });

    gulp.watch('./public/static/cssx/**/*.css').on('change', function (file) {

        var folderz = String(file.path).split(path.sep);
        var folds = [];

        var add = false;
        var prev = null;
        folderz.forEach(function (folder, index) {
            if (add === true) {
                folds.push(folder);
            }
            if (folder === 'static' && prev === 'public') {
                add = true;
            }
            prev = folder;
        });

        var reconciledPath = folds.join(path.sep);
        reconciledPath = 'text!' + reconciledPath;
        //reconciledPath = reconciledPath.substring(0,reconciledPath.length-3);

        io.sockets.emit('hot-reload (.css)', reconciledPath);
    });

});

gulp.task("done", function(done) {
    // This task completion was omitted.
    done();
});

gulp.task('dependenttask', ['mytask'], function() {
    //do stuff after 'mytask' is done.
});


//gulp.task('default', ['[watch] hot-reload'], function () {

gulp.task('default', ['watch'], function () {

    //var taskNames = Object.keys(this.tasks);
    //
    //console.log(taskNames);
    //
    //taskNames.forEach(function(name,index){
    //   if(name.indexOf('[metagen]') === 0){
    //       console.log(name);
    //       //gulp.run
    //       gulp.start(name, function (err,msg) {
    //           console.log('done with gulp task:',name);
    //       });
    //   }
    //});

});

