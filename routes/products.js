/**
 * Created by denman on 9/9/2015.
 */


/**
 * Created by amills001c on 6/15/15.
 */


var express = require('express');
var router = express.Router();
var IJSON = require('idempotent-json');

var get = require('../lib/httpHelpers/getModel.js');
var getAll = require('../lib/httpHelpers/getModels.js');
var post = require('../lib/httpHelpers/postModel.js');
var put = require('../lib/httpHelpers/putModel.js');
var del = require('../lib/httpHelpers/deleteModel.js');


router.param('product_id', function (req, res, next, product_id) {
    // TODO: typically we might sanity check that product_id is of the right format
    if (product_id == undefined || product_id == null) {
        console.log('null product_id');
        return next(new Error("product_id is null"));
    }
    else {
        next();
    }

    //var productModel = req.site.models.product;
    //req.specialParams = {};
    //
    //productModel.get(function (err, product) {
    //    product.findById(product_id, function (err, product) {
    //        if (err) {
    //            return next(err);
    //        }
    //        if (!product) {
    //            req.specialParams.product_model = null;
    //        }
    //        else {
    //            req.specialParams.product_model = product;
    //        }
    //
    //        next();
    //    });
    //});
});


// middleware specific to this router
//router.use(function timeLog(req, res, next) {
//    console.log('Time: ', Date.now());
//    next();
//});


router.get('/', function (req, res, next) {


    var productModel = req.site.models.Product;
    getAll(productModel, 'product', null, req, res, next);

});


router.get('/:product_id', function (req, res, next) {

    var productModel = req.site.models.Product;
    var product_id = req.params.product_id;
    get(productModel, 'Product', product_id, req, res, next);

});


router.post('/', function (req, res, next) {

    var productModel = req.site.models.product;
    var productData = req.body;
    post(productModel, null, productData, req, res, next);
});


router.put('/:product_id', function (req, res, next) {

    //TODO: do new product(data).update({upsert:true}) ?

    var productModel = req.site.models.Product;
    var productData = req.body;
    put(productModel, null, productData, null, req, res, next);

});


router.delete('/:product_id', function (req, res, next) {

    var productModel = req.site.models.Product;
    var product_id = req.params.product_id;
    del(productModel, null, product_id, req, res, next);

});


module.exports = router;
