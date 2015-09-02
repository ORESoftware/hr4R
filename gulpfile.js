//https://github.com/gulpjs/gulp/issues/1186
//https://medium.com/@webprolific/getting-gulpy-a2010c13d3d5

//TODO:https://github.com/wix/react-templates


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
var react = require('gulp-react');

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


var metagens = {

    "controllers": {
        inputFolder: './public/static/app/js/controllers',
        appendThisToDependencies: 'app/js/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allControllers.js'
    },
    "templates": {
        inputFolder: './public/static/app/templates',
        appendThisToDependencies: 'text!app/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allTemplates.js'
    },
    "css": {
        inputFolder: './public/static/cssx',
        appendThisToDependencies: 'text!',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allCSS.js'
    },
    "flux-constants": {
        inputFolder: './public/static/app/js/flux/constants',
        appendThisToDependencies: 'app/js/flux/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allFluxConstants.js'
    },
    "flux-actions": {
        inputFolder: './public/static/app/js/flux/actions',
        appendThisToDependencies: 'app/js/flux/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allFluxActions.js'
    },
    "relative-views": {
        inputFolder: './public/static/app/js/jsx/relViews',
        appendThisToDependencies: 'jsx!app/js/jsx/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allRelViews.js'
    },
    "react-components": {
        inputFolder: './public/static/app/js/jsx/reactComponents',
        appendThisToDependencies: 'jsx!app/js/jsx/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allReactComponents.js'
    }

};


function runMetagen(opts, cb) {
    grm(opts, function (err, res) {
        if (typeof cb === 'function') {
            cb(err, res)
        }
    })
}


gulp.task('watch:all', function () {

    gulp.watch('./public/static/app/templates/**/*.*').on('change', function (file) {
        runMetagen(metagens.templates, null);
    });

    gulp.watch('./public/static/app/js/controllers/**/*.*').on('change', function (file) {
        runMetagen(metagens.controllers, null);
    });

    gulp.watch('./public/static/app/js/jsx/relViews/**/*.*').on('change', function (file) {
        runMetagen(metagens['relative-views'], null);
    });

    gulp.watch('./public/static/app/js/jsx/reactComponents/**/*.*').on('change', function (file) {
        runMetagen(metagens['react-components'], null);
    });

    gulp.watch('./public/static/cssx/**/*.*').on('change', function (file) {
        runMetagen(metagens['css'], null);
    });

    gulp.watch('./public/static/app/js/flux/constants/**/*.*').on('change', function (file) {
        runMetagen(metagens['flux-constants'], null);
    });

    gulp.watch('./public/static/app/js/flux/actions/**/*.*').on('change', function (file) {
        runMetagen(metagens['flux-actions'], null);
    });

});


function reconcilePathForRequireJS(file) {
    var folderz = String(file.path).split('/');
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

    return folds.join('/');
}


gulp.task('watch:hot-reload', function () {


    gulp.watch('./public/static/**/*.ejs').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = 'text!' + reconciledPath;

        io.sockets.emit('hot-reload (.ejs)', reconciledPath);
    });

    gulp.watch('./public/static/app/js/jsx/**/*.js').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = 'jsx!' + reconciledPath.substring(0, reconciledPath.length - 3);

        io.sockets.emit('hot-reload (.jsx)', reconciledPath);
    });

    gulp.watch('./public/static/app/js/views/**/*.js').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = 'jsx!' + reconciledPath.substring(0, reconciledPath.length - 3);

        io.sockets.emit('hot-reload (.js)', reconciledPath);
    });

    gulp.watch('./public/static/cssx/**/*.css').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = 'text!' + reconciledPath;

        io.sockets.emit('hot-reload (.css)', reconciledPath);
    });

});

gulp.task('transpile-jsx', ['metagen:all'], function () {
    return gulp.src('./public/static/app/js/views/**/*.js')
        .pipe(react({harmony: false}))
        .pipe(gulp.dest('./public/static/app/js/jsx'));
});


gulp.task('dependenttask', ['mytask'], function () {
    //do stuff after 'mytask' is done.
});


gulp.task('metagen:all', function (done) {

    var taskNames = Object.keys(metagens);
    var funcs = [];

    taskNames.forEach(function (name, index) {
        funcs.push(function (cb) {
            runMetagen(metagens[name], function (err, res) {
                cb(err, res)
            });
        })
    });

    async.parallel(funcs, function (err, results) {
        done();
    });
});


gulp.task('default', ['transpile-jsx', 'metagen:all', 'watch:all', 'watch:hot-reload'], function (done) {

    done();

});

