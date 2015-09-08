/**
 * Created by denman on 9/7/2015.
 */

var async = require('async');
var _ = require('underscore');
var grm = require('requirejs-metagen');

var metagens = {

    "CONTROLLERS": {
        inputFolder: './public/static/app/js/controllers/all',
        appendThisToDependencies: 'app/js/controllers/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
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
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allFluxConstants.js'
    },
    "flux-actions": {
        inputFolder: './public/static/app/js/flux/actions',
        appendThisToDependencies: 'app/js/flux/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: false,
        output: './public/static/app/js/meta/allFluxActions.js'
    },
    "all-views": {
        inputFolder: './public/static/app/js/jsx',
        appendThisToDependencies: 'app/js/',
        appendThisToReturnedItems: '',
        eliminateSharedFolder: true,
        output: './public/static/app/js/meta/allViews.js'
    }
    //"relative-views": {
    //    inputFolder: './public/static/app/js/jsx/relViews',
    //    appendThisToDependencies: 'app/js/jsx/',
    //    appendThisToReturnedItems: '',
    //    eliminateSharedFolder: false,
    //    output: './public/static/app/js/meta/allRelViews.js'
    //},
    //"react-components": {
    //    inputFolder: './public/static/app/js/jsx/reactComponents',
    //    appendThisToDependencies: 'app/js/jsx/',
    //    appendThisToReturnedItems: '',
    //    eliminateSharedFolder: true,
    //    output: './public/static/app/js/meta/allReactComponents.js'
    //},
    //"standard-views": {
    //    inputFolder: './public/static/app/js/jsx/standardViews',
    //    appendThisToDependencies: 'app/js/jsx/',
    //    appendThisToReturnedItems: '',
    //    eliminateSharedFolder: true,
    //    output: './public/static/app/js/meta/allStandardViews2.js'
    //}

};

var taskNames = Object.keys(metagens);
var funcs = [];

taskNames.forEach(function (name, index) {
    funcs.push(function (cb) {
        grm(metagens[name], function (err) {
            cb(err);
        });
    });
});

async.parallel(funcs);