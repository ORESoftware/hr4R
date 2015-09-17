/**
 * Created by amills001c on 9/9/15.
 */


/**
 * Created by amills001c on 7/17/15.
 */


/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/models/jobModel.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html

//http://stackoverflow.com/questions/6351271/backbone-js-get-and-set-nested-object-attribute

define(
    [
        'underscore',
        'app/js/models/BaseModel',
        '#allFluxConstants'
    ],

    function (_, BaseModel, allFluxConstants) {

        var FluxCartConstants = allFluxConstants['FluxCartConstants'];


        var CartProduct = BaseModel.extend({

                urlRoot: function () {
                    return '/products'
                },

                defaults: function () { //prevents copying default attributes to all instances of JobModel
                    return {
                        id:'5',
                        productName:'',
                        description:'',
                        price: 0,
                        quantity: 0,
                        sku: null,
                        inventory:5,

                        variants: [
                            {
                                sku: '123123',
                                type: '40oz Bottle',
                                price: 4.99,
                                inventory: 1

                            },
                            {
                                sku: '123124',
                                type: '6 Pack',
                                price: 12.99,
                                inventory: 5
                            },
                            {
                                sku: '1231235',
                                type: '30 Pack',
                                price: 19.99,
                                inventory: 3
                            }
                        ]
                    }
                },

                initialize: function (attributes, opts) {

                    this.options = opts || {};
                    this.givenName = '@CartProductModel';

                    _.bindAll(this, 'deleteModel', 'persistModel', 'validate', 'parse');

                },


                validate: function (attr) {
                    //if (attr.ID <= 0) {
                    //    return "Invalid value for ID supplied."
                    //}

                    //TODO:https://github.com/thedersen/backbone.validation

                    return undefined;
                }

            },

            { //class properties

            });


        return CartProduct;
    });