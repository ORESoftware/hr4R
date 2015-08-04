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
        'app/js/allModels',
        'app/js/allCollections',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'backbone-validation',
        'react',
        'jsx!app/js/views/reactViews/TimerExample',
        'jsx!app/js/views/reactViews/MenuExample',
        'text!app/templates/homeTemplate.ejs'
    ],


    function (appState, models, collections, form2js, EJS, $, _, Backbone, BackboneValidation, React, TimerExample, MenuExample, template) {


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

                        var ret = EJS.render(HomeView.template, {});

                        self.$el.html(ret);

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

        return HomeView;

    })
;

