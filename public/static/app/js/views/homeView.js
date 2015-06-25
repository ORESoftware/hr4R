/**
 * Created by amills001c on 6/11/15.
 */


console.log('loading homeView');

define(['app/js/models','app/js/collections', 'form2js','ejs','jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (models,collections, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var HomeView = Backbone.View.extend({

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            model:null,
            collection: collections.users,

            //TODO: cache template

            template: null,

            el: '#main-div-id',

            initialize: function () {

                //_.bind(this.initialize,undefined);
                _.bindAll(this, 'render','show','handleModelSyncSuccess','handleModelError');
                this.listenTo(this.collection,'reset', this.render);
                this.listenTo(this.collection,'add', this.addOne);
                this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                this.listenTo(this.model, 'error', this.handleModelError);
                this.listenTo(Backbone, 'books:created', this.show);
            },

            show:function(){

                console.log('heard about BOOKS:CREATED: this:',this);

            },
            render: function () {
                console.log('attempting to render HomeView.');

                var self = this;

                if(this.template == null){

                    $.ajax({
                        url: 'static/html/ejs/homeTemplate.ejs',
                        type: 'GET',
                        success: function(msg) {
                            var ret = EJS.render(msg, {
                                title:'Welcome to the jungle',
                                //filename: '/static/html/ejs/indexEJSTemplate.ejs'
                            });


                            self.$el.html(ret);
                            //$('body').append(ret);
                            console.log('HomeView rendered');
                        },
                        error: function(err) {
                            console.log('error:',err);
                        }
                    });
                }
                else{
                    var ret = EJS.render(this.template, {
                        title:'Welcome to the jungle',
                        //filename: '/static/html/ejs/indexEJSTemplate.ejs'
                    });


                    self.$el.html(ret);
                    //$('body').append(ret);
                    console.log('HomeView (re)rendered');

                }

                return this;
            },
            handleModelSyncSuccess: function(){
                console.log('model sync success');
            },
            handleModelError: function(){
                console.log('model error!! in this:',this);
            }
        });


        return HomeView;

    });

