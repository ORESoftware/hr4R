/**
 * Created by amills001c on 6/16/15.
 */

//TODO:https://github.com/marionettejs/backbone.marionette/issues/611

console.log('loading headerView');

define(
    [
        '#appState',
        'async',
        'app/js/allCollections',
        'app/js/allModels',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'text!app/templates/header.ejs'
    ],


    function (appState, async, collections, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        //var router = routers(null).bootRouter;//

        //var hvTemplate = null; don't need this because header is not recreated - just repopulated
        //TODO: http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view

        var HeaderView = Backbone.View.extend({

            className: 'HeaderView',

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            model: null,

            template: null,

            //el: '#header-div-id',

            el: '#index_header_div_id',

            events: {
                'click #logout-button-id': 'onClickLogout',
                'click #reset-all-button-id': 'onClickResetAll',
                'click #reset-front-end-button-id': 'onClickResetFrontEnd',
                'click #reset-back-end-button-id': 'onClickResetBackEnd'
            },

            initialize: function (options) {
                //_.bind(this.initialize,undefined); //wanted to remove initialize function from the view instance so we don't accidentally 'reinitialize'
                this.options = options || {};
                _.bindAll(this, 'render', 'onClickResetAll', 'onClickResetFrontEnd', 'onClickResetBackEnd');
            },

            render: function () {
                console.log('attempting to render HeaderView.');

                var self = this;

                if (HeaderView.template == null) {

                    console.log('headerView template is null, retrieving from server.')

                    $.ajax({
                        url: 'static/html/ejs/header.ejs',
                        type: 'GET',
                        success: function (msg) {
                            HeaderView.template = msg;
                            var ret = EJS.render(HeaderView.template, {appState: appState});
                            self.$el.html(ret);
                        },
                        error: function (err) {
                            alert(err.toString());
                        }
                    });
                }
                else {

                    //var ret = EJS.render(HeaderView.template, {appState:appState});
                    var ret = EJS.render(HeaderView.template, {appState: appState});
                    self.$el.html(ret);

                }

                console.log('re-rendered headerView.');

                return this;
            },

            onClickLogout: function (event) {
                event.preventDefault();

                console.log('attempting to log out...');

                $.ajax({
                    url: '/logout',
                    data: {},
                    dataType: 'json',
                    type: 'POST',
                    success: function (msg) {
                        if (msg === true) {
                            appState.set('currentUser', null);
                            Backbone.Events.trigger('bootRouter', 'index');
                            //TODO:why does log out work even if router.navigate isn't invoked?
                            //Backbone.history.loadUrl();
                        }
                        else {
                            alert('logout failed on server, please try again.')
                        }

                    },
                    error: function (err) {
                        console.log('error:', err);
                        alert('internal server error - logout failed.')
                        //Backbone.history.loadUrl();
                    }
                });
            },
            onClickResetAll: function (event) {
                event.preventDefault();

                var deletes = [];

                Object.keys(collections).forEach(function (key) {
                    if (collections.hasOwnProperty(key)) {


                        var coll = collections[key];

                        //for (var i = 0; i < coll.models.length; i++) {

                        coll.each(function(model, i) {
                            deletes.push(function (callback) {

                                console.log(model.givenName);

                                model.deleteModel(function (err, resp, x) {

                                    console.log(err, resp, x);

                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        callback(null, null);
                                    }

                                });
                            });


                            //}

                        });
                    }
                });

                async.parallel(deletes,function(err,results){

                    Backbone.Events.trigger('bootRouter', '+refreshCurrentPage');

                });


            },
            onClickResetFrontEnd: function (event) {
                event.preventDefault();
                console.log('clicked onClickResetFrontEnd');
                Object.keys(collections).forEach(function (key) {
                    if (collections.hasOwnProperty(key)) {
                        collections[key].reset();
                        console.log(collections[key].givenName, 'has been reset.');
                    }
                });

            },
            onClickResetBackEnd: function (event) {
                event.preventDefault();


            }
        });

        HeaderView.template = template;

        return HeaderView;
    });