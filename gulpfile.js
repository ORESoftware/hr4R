/**
 * Created by amills001c on 6/9/15.
 */

//TODO: https://github.com/gulpjs/gulp/issues/1186
//TODO: https://medium.com/@webprolific/getting-gulpy-a2010c13d3d5
//TODO: https://github.com/wix/react-templates
//TODO: http://10consulting.com/2014/02/11/pipes-and-filters-to-cure-node-async-woes/


//core
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var async = require('async');
var _ = require('underscore');
var EE = require('events').EventEmitter;

//gulp plugins
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');

//misc
var grm = require('requirejs-metagen');


/*
 Gulp uses vinyl-fs, from which it inherits the gulp.src() and gulp.dest() methods.
 Vinyl-fs uses the vinyl file object, its “virtual file format”.
 */


var metagens = {

    "controllers": {
        inputFolder: './public/static/app/js/controllers/all',
        appendThisToDependencies: 'app/js/controllers/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allControllers.js'
    },
    "models": {
        inputFolder: './public/static/app/js/models/all',
        appendThisToDependencies: 'app/js/models/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allModels.js'
    },
    "collections": {
        inputFolder: './public/static/app/js/collections/all',
        appendThisToDependencies: 'app/js/collections/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allCollections.js'
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
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allFluxActions.js'
    },
    "all-views": {
        inputFolder: './public/static/app/js/jsx',
        appendThisToDependencies: 'app/js/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allViews.js'
    }

};


function runMetagen(opts, cb) {
    grm(opts, function (err) {
        if (typeof cb === 'function') {
            cb(err);
        }
    });
}


gulp.task('watch:metagen', function () {

    //gulp.watch('./public/static/app/templates/**/*.*').on('change', function (file) {
    //    runMetagen(metagens.templates, null);
    //});
    //
    //gulp.watch('./public/static/app/js/controllers/**/*.*').on('change', function (file) {
    //    runMetagen(metagens.controllers, null);
    //});
    //
    //gulp.watch('./public/static/app/js/jsx/relViews/**/*.*').on('change', function (file) {
    //    runMetagen(metagens['relative-views'], null);
    //});
    //
    //gulp.watch('./public/static/app/js/jsx/reactComponents/**/*.*').on('change', function (file) {
    //    runMetagen(metagens['react-components'], null);
    //});
    //
    //gulp.watch('./public/static/app/js/jsx/standardViews/**/*.*').on('change', function (file) {
    //    runMetagen(metagens['standard-views'], null);
    //});
    //
    //gulp.watch('./public/static/cssx/**/*.*').on('change', function (file) {
    //    runMetagen(metagens['css'], null);
    //});
    //
    //gulp.watch('./public/static/app/js/flux/constants/**/*.*').on('change', function (file) {
    //    runMetagen(metagens['flux-constants'], null);
    //});
    //
    //gulp.watch('./public/static/app/js/flux/actions/**/*.*').on('change', function (file) {
    //    runMetagen(metagens['flux-actions'], null);
    //});

});

function replaceAll(str, target, replacement) {
    return str.split(target).join(replacement);
}

function reconcilePathForRequireJS(file) {

    var filepath = replaceAll(path.normalize(String(path.resolve(file.path))), '\\', '/');

    var folderz = String(filepath).split('/');
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


    gulp.watch('./public/static/**/*.ejs').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = 'text!' + reconciledPath;

        io.sockets.emit('start-progress-bar');

        setTimeout(function () {
            io.sockets.emit('hot-reload (.ejs)', reconciledPath);
        }, 100);

    });

    gulp.watch('./public/static/app/js/views/**/*.js').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = reconciledPath.replace('views', 'jsx');
        reconciledPath = reconciledPath.substring(0, reconciledPath.length - 3);

        io.sockets.emit('start-progress-bar');

        var ee = transpileJSX();

        ee.on('error', function (err) {
            io.sockets.emit('.jsx transform error', JSON.stringify(err))
        });

        ee.on('end', function () {
            io.sockets.emit('hot-reload (.jsx)', reconciledPath);
        });

    });


    gulp.watch('./public/static/cssx/**/*.css').on('change', function (file) {

        var reconciledPath = reconcilePathForRequireJS(file);
        reconciledPath = 'text!' + reconciledPath;

        io.sockets.emit('start-progress-bar');

        setTimeout(function () {
            io.sockets.emit('hot-reload (.css)', reconciledPath);
        }, 100);

    });


});


gulp.task('transpile-jsx', function (cb) {
    var ee =  transpileJSX();
    ee.on('error', function (err) {
        cb(err);
    });

    ee.on('end', function (msg) {
        cb(null);
    });
});

function transpileJSX() {

    var ee = new EE();

    gulp.src('./public/static/app/js/views/**/*.js')

        .pipe(react({harmony: false})).on('error', function (err) {

            ee.emit('error',err);
        })
        .pipe(gulp.dest('./public/static/app/js/jsx')).on('error', function (err) {

            ee.emit('error',err);

        }).on('end', function () {

            ee.emit('end');

        });

    return ee;
}


function transpileFile(file) {

    var dest = file.path.replace('views', 'jsx');

    return gulp.src(file.path)
        .pipe(react({harmony: false}))
        .pipe(gulp.dest(dest));
}


gulp.task('metagen:all', ['transpile-jsx'], function (done) {

    var taskNames = Object.keys(metagens);
    var funcs = [];

    taskNames.forEach(function (name) {
        funcs.push(function (cb) {
            grm(metagens[name], function (err) {
                cb(err);
            });
        });
    });

    async.parallel(funcs, function (err) {
        done(err);
    });
});



gulp.task('nodemon', ['metagen:all','watch:hot-reload'], function () {

    nodemon({

        script: 'bin/www.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }

    }).on('restart', ['metagen:all']);

});


gulp.task('default', ['metagen:all', 'watch:hot-reload'], function (done) {
    done();
});


