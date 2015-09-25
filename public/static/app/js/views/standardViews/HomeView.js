/**
 * Created by denmanm1 on 6/11/15.
 */

//TODO:https://www.safaribooksonline.com/library/view/developing-backbonejs-applications/9781449328535/ch04s03.html
//TODO: http://www.svlada.com/require-js-optimization-part2/#t2
//TODO: http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/


console.log('loading homeView');

define(
    [
        '+appState',
        '#allModels',
        '#allCollections',
        'form2js',
        'ejs',
        'underscore',
        'backbone-validation',
        'react',
        '#allFluxActions',
        'require'
    ],

    function (appState, models, collections, form2js, EJS, _, BackboneValidation, React, allFluxActions, require) {


        var FluxCartActions = allFluxActions['FluxCartActions'];

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

                constructor: function (opts) {
                    this.givenName = '@HomeView';
                    Backbone.View.apply(this, arguments);
                },


                initialize: function (opts) {

                    this.setViewProps(opts);
                    _.bindAll(this, 'render');

                    this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                    this.listenTo(this.model, 'error', this.handleModelError);
                },


                nodes: ['#react-timer-example-div-id', '#react-menu-example-div-id'],

                render: function () {

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/homeTemplate.ejs'];

                    var ret = EJS.render(template, {});

                    self.$el.html(ret);

                    var TimerExample = allViews['reactComponents/TimerExample'];
                    var MenuExample = allViews['reactComponents/MenuExample'];

                    React.render(
                        <TimerExample start={Date.now()}/>,
                        $(self.el).find('#react-timer-example-div-id')[0]
                    );

                    React.render(
                        <MenuExample items={ ['Home', 'Services', 'About', 'Contact us'] }/>,
                        $(self.el).find('#react-menu-example-div-id')[0]
                    );

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
                //template: template
            }
        );


        return HomeView;

    });

