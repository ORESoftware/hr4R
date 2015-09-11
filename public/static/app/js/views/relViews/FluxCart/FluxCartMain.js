/**
 * Created by amills001c on 9/9/15.
 */



define(
    [
        '#appState',
        '#allModels',
        '#allCollections',
        'form2js',
        'ejs',
        'underscore',
        'backbone-validation',
        'react',
        'require'
    ],


    /** @jsx React.DOM */

    function (appState, models, collections, form2js, EJS, _ , BackboneValidation, React,require) {



        /** @jsx React.DOM */
        var FluxCart = Backbone.View.extend({


                defaults: function () {
                    return {
                        collection: null,
                        model: null
                    };
                },

                constructor: function (opts) {
                    this.givenName = '@FluxCartView';
                    Backbone.View.apply(this, arguments);
                },



                initialize: function (opts) {

                    this.setViewProps(opts);
                    _.bindAll(this, 'render');

                },

                nodes: ['#react-flux-cart-example-div-id'],

                render: function () {

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/fluxCartTemplate.ejs'];

                    var ret = EJS.render(template, {});

                    self.$el.html(ret);

                    var FluxCartApp = allViews['controllerViews/FluxCartApp'];

                    React.render(
                        <FluxCartApp />,
                        $(self.el).find('#react-flux-cart-example-div-id')[0]
                    );

                    return this;

                }
            },

            { //class properties
                //template: template
            }
        );




        return FluxCart;

    });