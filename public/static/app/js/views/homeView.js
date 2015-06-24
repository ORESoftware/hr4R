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

            el: '#main-div-id',

            initialize: function () {

                //TODO: why have this video have it's own collection, just use global user collection? (collections.users)
                var coll = this.collection;

               /* coll.each(function(item,index) {
                   if(item.username === appGlobal.currentUser.username){
                       this.model = item;
                   }
                });

                if(this.model === null){
                    throw new Error('no user found in users collection')
                }
                this.model = new models.UserModel(appGlobal.currentUser);*/

                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
                this.listenTo(this.model, 'sync', this.handleModelSyncSuccess);
                this.listenTo(this.model, 'error', this.handleModelError);
                this.listenTo(Backbone, 'books:created', this.show);
                //this.model.bind('change', this.render);
            },

            show:function(){

                console.log('heard about BOOKS:CREATED: this:',this);

            },
            render: function () {
                console.log('attempting to render HomeView.');

                var self = this;

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

