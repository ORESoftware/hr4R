/**
 * Created by amills001c on 6/16/15.
 */

//TODO:https://github.com/marionettejs/backbone.marionette/issues/611

console.log('loading headerView');

define(
    [
        //'app/js/routers',
        'app/js/models',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation'
    ],


    function (models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        //var router = routers(null).bootRouter;

        //var hvTemplate = null; don't need this because header is not recreated - just repopulated
        //TODO: http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view

        var HeaderView = Backbone.View.extend({

            className:'HeaderView',

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            model:null,

            template: null,

            //el: '#header-div-id',

            el: '#index_header_div_id',

            events: {
                'click #logout-button-id': 'onClickLogout'
            },

            initialize: function (options) {
                //_.bind(this.initialize,undefined); //wanted to remove initialize function from the view instance so we don't accidentally 'reinitialize'
                this.options = options || {};
                _.bindAll(this, 'render');
            },

            render: function () {
                console.log('attempting to render HeaderView.');

                var self = this;

                if(self.template == null){

                    console.log('headerView template is null, retrieving from server.')

                    $.ajax({
                        url: 'static/html/ejs/header.ejs',
                        type: 'GET',
                        success: function (msg) {
                            self.template = msg;
                            var ret = EJS.render(self.template, appGlobal);
                            self.$el.html(ret);
                        },
                        error: function (err) {
                            alert(err.toString());
                        }
                    });
                }
                else{

                    var ret = EJS.render(self.template, appGlobal);
                    self.$el.html(ret);

                }

                console.log('re-rendered headerView.');

                return this;
            },

            onClickLogout: function(event){
                event.preventDefault();

                console.log('attempting to log out...');

                $.ajax({
                    url: '/logout',
                    data: {},
                    dataType: 'json',
                    type: 'POST',
                    success: function (msg) {
                        if(msg === true){
                            appGlobal.currentUser = null;
                            appGlobal.authorized = false;
                            //router.navigate('index',{trigger:true});
                            Backbone.Events.trigger('bootRouter','index');
                            //TODO:why does log out work even if router.navigate isn't invoked?
                            //Backbone.history.loadUrl();
                        }
                        else{
                            alert('logout failed.')
                        }


                    },
                    error: function (err) {
                        console.log('error:', err);
                        alert('internal server error - logout failed.')
                        appGlobal.currentUser = null;
                        appGlobal.authorized = false;
                        //router.navigate('index',{trigger:true});
                        //TODO:why does log out work even if router.navigate isn't invoked?
                        Backbone.Events.trigger('bootRouter','index');
                        //Backbone.history.loadUrl();
                    }
                });

            }
        });

        HeaderView.template = null;

        return HeaderView;
    });