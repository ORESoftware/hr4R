/**
 * Created by amills001c on 6/11/15.
 */

//TODO:https://www.safaribooksonline.com/library/view/developing-backbonejs-applications/9781449328535/ch04s03.html
//TODO: http://www.svlada.com/require-js-optimization-part2/#t2
//TODO: http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/


console.log('loading homeView');

define(
    [
        '#appState',
        '#allModels',
        '#allCollections',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation',
        'react',
        '#allReactComponents',
        '#allTemplates',
        '#allFluxActions'
    ],


    /** @jsx React.DOM */

    function (appState, models, collections, form2js, EJS, $, _, Backbone,
              BackboneValidation, React, allReactComponents, allTemplates, allFluxActions) {


        var FluxCartApp = allReactComponents['reactComponents/FluxCartApp'];
        var TimerExample = allReactComponents['reactComponents/TimerExample'];
        var MenuExample = allReactComponents['reactComponents/MenuExample'];

        var FluxCartActions = allFluxActions['actions/FluxCartActions'];

        var template = allTemplates['templates/homeTemplate.ejs'];

        /** @jsx React.DOM */
        var HomeView = Backbone.View.extend({

                //id: 'HomeViewID',
                //tagName: 'HomeViewTagName',
                //className: 'HomeViewClassName',


                defaults: function () {
                    return {
                        collection: collections.users,
                        model: null
                    }
                },

                //el: '#main-div-id',

                constructor: function (opts) {
                    this.givenName = '@HomeView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts);
                    _.bindAll(this, 'render', 'show', 'onChange', 'handleModelSyncSuccess', 'handleModelError');
                    //this.listenTo(this.collection, 'add reset', this.render);
                    //this.listenTo(this.collection, 'change', this.onChange, this);
                    this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                    this.listenTo(this.model, 'error', this.handleModelError);
                    //this.listenTo(Backbone.Events, 'books:created', this.show);
                },


                show: function () {
                    console.log('heard about BOOKS:CREATED: this:', this);
                },

                onChange: function (msg) {

                    //console.log(msg);
                },


                render: function () {
                    console.log('attempting to render HomeView.');

                    var self = this;

                    alert('PXpppppXX');///////////////

                    var ret = EJS.render(HomeView.template, {});

                    self.$el.html(ret);

                    // Load Mock Product Data into localStorage
                    ProductData.init();

                    // Load Mock API Call
                    CartAPI.getProductData();

                    ////////////////////////////

                    React.render(
                        <FluxCartApp />,
                        $(self.el).find('#react-flux-cart-example-div-id')[0]
                    );

                    React.render(
                        <TimerExample start={Date.now()}/>,
                        //self.el
                        //$('#react-timer-example-div-id')[0]
                        $(self.el).find('#react-timer-example-div-id')[0]
                    );

                    React.render(
                        <MenuExample items={ ['Home', 'Services', 'About', 'Contact us'] }/>,
                        //$('#react-menu-example-div-id')[0]
                        //document.getElementById('react-menu-example-div-id')
                        $(self.el).find('#react-menu-example-div-id')[0]
                    );

                    ///////////////////

                    console.log('HomeView (re)rendered');


                    return this;
                },
                handleModelSyncSuccess: function () {
                    console.log('model sync success');
                }
                ,
                handleModelError: function () {
                    console.log('model error!! in this:', this);
                }
            },

            { //class properties
                template: template
            }
        );

        var CartAPI = {

            // Load mock product data from localStorage into ProductStore via Action
            getProductData: function () {
                var data = JSON.parse(localStorage.getItem('product'));
                FluxCartActions.receiveProduct(data);
            }

        };

        var ProductData = {
            // Load Mock Product Data Into localStorage
            init: function () {
                localStorage.clear();
                localStorage.setItem('product', JSON.stringify([
                    {
                        id: '0011001',
                        name: 'Scotch.io Signature Lager',
                        image: 'scotch-beer.png',
                        description: 'The finest lager money can buy. Hints of keyboard aerosol, with a whiff of iKlear wipes on the nose. If you pass out while drinking this beverage, Chris Sevilleja personally tucks you in.',
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
                ]));
            }

        };

        return HomeView;

    });

