//https://github.com/gulpjs/gulp/issues/1186


//core
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io')

//plugins
var jshint = require('gulp-jshint');
var replaceStream = require('replacestream');
var replace = require('gulp-replace');
var source  = require('vinyl-source-stream');

//misc
var fse = require('fs-extra');
var grm = require('gulp-requirejs-metagen');



var io = socketio.listen('3002',function(err,msg){
    if(err){
        console.error(err);
    }
    console.log(msg);
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
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




gulp.task('watch', function () {


    gulp.watch('./public/static/**/*.ejs').on('change', function(file) {

        var folderz = String(file.path).split(path.sep);
        var folds = [];

        var add = false;
        var prev = null;
        folderz.forEach(function(folder,index){
            if(add === true){
                folds.push(folder);
            }
            if(folder === 'static' && prev === 'public'){
                add = true;
            }
            prev = folder;
        });

        var reconciledPath = folds.join(path.sep);
        reconciledPath = 'text!'+reconciledPath;

        io.sockets.emit('hot-reload.ejs',reconciledPath);
    });

    gulp.watch('./public/static/app/js/views/**/*.js').on('change', function(file) {

        var folderz = String(file.path).split(path.sep);
        var folds = [];

        var add = false;
        var prev = null;
        folderz.forEach(function(folder,index){
            if(add === true){
                folds.push(folder);
            }
            if(folder === 'static' && prev === 'public'){
                add = true;
            }
            prev = folder;
        });

        var reconciledPath = folds.join(path.sep);
        reconciledPath = 'jsx!'+ reconciledPath.substring(0,reconciledPath.length-3);

        io.sockets.emit('hot-reload.JS',reconciledPath);
    });

});


gulp.task('default', ['watch'], function () {

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

