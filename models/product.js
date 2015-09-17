/**
 * Created by denman on 9/9/2015.
 */


// dependencies
var mongoose = require('mongoose');
var validator = require('mongoose-validate');


// variables
var mongoDB = null;
var productSchema = null;


var validation = {

    productNameValidator: function (candidate) {
        console.log(candidate);
        return true;
    }
};


var registerSchema = function () {

    productSchema = mongoose.Schema({
            productName: {
                type: String
            },
            description: {
                type: String
            },
            price: {
                type: Number
            },
            quantity: {
                type: Number
            },
            sku: {
                type: String
            },
            created_by: {
                type: String,
                required: false,
                default: 'created by unknown user'
            },
            updated_by: {
                type: String,
                required: false,
                default: 'updated by unknown user'
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            updated_at: {
                type: Date,
                default: Date.now
            }
        },
        {
            autoIndex: false
        });

    productSchema.pre('save', function (next) {
        return next();
    });


    productSchema.post('save', function (doc) {
        console.log('%s has been saved', doc._id);
    });

};


var ProductModel = null;


var get = function (cb) {

    //eventBus.emit('productModel','message from product model via eventBus!');

    if (ProductModel === null) {
        ProductModel = mongoDB.model('products', productSchema);

        //TODO: db.collection.createIndex(keys, options)

        ProductModel.ensureIndexes(function (err) {
            if (err) {
                console.log(colors.bgRed(err));
            }
            else {
                cb(err, ProductModel);
            }
        });

        ProductModel.on('index', function (err, msg) {
            if (err) {
                console.log(colors.bgRed(err));
                throw err;
            }
            console.log('index event', msg);
        });
    }
    else {
        cb(null, ProductModel);
    }
};


module.exports = function ($mongoDB) {
    mongoDB = $mongoDB;
    registerSchema();
    return {
        registerSchema: registerSchema,
        get: get
    }
};
