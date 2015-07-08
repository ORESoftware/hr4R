/**
 * Created by amills001c on 6/11/15.
 */

//TODO:https://www.safaribooksonline.com/library/view/developing-backbonejs-applications/9781449328535/ch04s03.html
//TODO: http://www.svlada.com/require-js-optimization-part2/#t2

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
        'handlebars',
        'backbone',
        'backbone-validation',
        //'text!app/templates/homeTemplate.ejs'
        //'app/js/allTemplates'
        //'app/js/optimized_templates'
        'text!app/templates/homeTemplate.ejs'
        //'text!homeTemplate.html'
    ],


    function (appState, models, collections, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        //var templateHtml = require('text!app/templates/homeTemplate.ejs');  //load the template//

        //var template = allTemplates.HomeTemplate;

        var HomeView = Backbone.View.extend({

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            //className:'HomeView',

            givenName: 'HomeView',

            model: null,
            collection: collections.users,

            template: null,

            el: '#main-div-id',

            initialize: function (options) {

                this.options = options || {};
                _.bindAll(this, 'render', 'show', 'handleModelSyncSuccess', 'handleModelError');
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'add', this.addOne);
                this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                this.listenTo(this.model, 'error', this.handleModelError);
                this.listenTo(Backbone, 'books:created', this.show);
            },


            show: function () {
                console.log('heard about BOOKS:CREATED: this:', this);
            },


            render: function () {
                console.log('attempting to render HomeView.');

                var self = this;

                if (HomeView.template == null) {

                    console.log('homeView template is null, retrieving from server.')

                    $.ajax({
                        url: 'static/html/ejs/homeTemplate.ejs',
                        type: 'GET',
                        success: function (msg) {
                            HomeView.template = msg;
                            renderThis.bind(self)(msg);
                        },
                        error: function (err) {
                            console.log('error:', err);
                        }
                    });
                }
                else {
                    renderThis.bind(self)(HomeView.template);
                }

                function renderThis($template) {

                    var ret = EJS.render($template, {});

                    self.$el.html(ret);
                    console.log('HomeView (re)rendered');
                }

                return this;
            },
            handleModelSyncSuccess: function () {
                console.log('model sync success');
            },
            handleModelError: function () {
                console.log('model error!! in this:', this);
            }
        });

        HomeView.template = template;

        return HomeView;

    });

