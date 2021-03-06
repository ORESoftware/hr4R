/**
 * Created by denmanm1 on 6/9/15.
 */


//core
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var async = require('async');
var _ = require('underscore');
var EE = require('events').EventEmitter;
var colors = require('colors/safe');
var request = require('request');

//gulp plugins
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');
var ijson = require('idempotent-json');

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

gulp.task('watch:metagen', function () {
    gulp.watch('./public/static/app/js/**/*.js').on('change', function (file) {
        runAllMetagens(function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
});


gulp.task('watch:hot-reload-back-end', function () {

    //if route file changes, we just reload that one route
    //but if some other module changes, we have to reload all routes because any could be potentially impacted?

    gulp.watch('./routes/**/*.js').on('change', function (file) {

        request({
                method: 'POST',
                json: {
                    path: file.path
                },
                uri: 'http://localhost:3000/hot-reload'
            },
            function (err, response, body) {
                if (err) {
                    console.log(colors.red(ijson.parse(err).error));
                }
                else {
                    console.log(colors.blue(ijson.parse(body).success));
                }
            });
    });
});


gulp.task('watch:hot-reload-front-end', function () {

    var io = socketio.listen('3002', function (err, msg, msg2) {
        if (err) {
            console.error(err);
        }
        else if (msg) {
            console.log(msg);
        }
    });

    io.on('connection', function (socket) {
        console.log(colors.yellow('Gulp hot reload: a developer client connected'));
        socket.on('disconnect', function () {
            console.log(colors.yellow('Gulp hot reload: a developer client disconnected'));
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
    var ee = transpileJSX();
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
            ee.emit('error', err);
        })
        .pipe(gulp.dest('./public/static/app/js/jsx')).on('error', function (err) {
            ee.emit('error', err);

        }).on('end', function () {
            ee.emit('end');
        });

    return ee;
}


function transpileFile(file) {
    //this doesn't work yet
    var dest = file.path.replace('views', 'jsx');
    return gulp.src(file.path)
        .pipe(react({harmony: false}))
        .pipe(gulp.dest(dest));
}

function runAllMetagens(done) {
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
}


gulp.task('metagen:all', ['transpile-jsx'], function (done) {
    runAllMetagens(done);
});


gulp.task('nodemon', ['metagen:all', 'watch:hot-reload-front-end', 'watch:hot-reload-back-end'], function () {

    nodemon({

        script: 'bin/www.js',
        ext: 'js',
        ignore: ['public/*', '*.git/*', '*.idea/*', 'routes/*', 'gulpfile.js'],
        args: ['--use_socket_server', '--use_hot_reloader'],
        nodeArgs: [],
        env: {'NODE_ENV': 'development'}

    }).on('restart', []);

});


//gulp.task('default', ['metagen:all',/* 'watch:metagen',*/ 'watch:hot-reload'], function (done) {
//    done();
//});


