/**
 * Created by amills001c on 6/16/15.
 */

//TODO:https://github.com/marionettejs/backbone.marionette/issues/611

console.log('loading headerView');

define(
    [
        '#appState',
        '#viewState',
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


    function (appState, viewState, async, collections, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        //TODO: http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view

        var HeaderView = Backbone.View.extend({

                defaults: function () {
                    return {
                        model: null,
                        collection: null,
                        childViews: {
                            childLoginView: null,
                            childRegisteredUsersView: null
                        }
                    }
                },

                el: '#index_header_div_id',

                events: {
                    'click #logout-button-id': 'onClickLogout',
                    'click #reset-all-button-id': 'onClickResetAll',
                    'click #reset-front-end-button-id': 'onClickResetFrontEnd',
                    'click #reset-back-end-button-id': 'onClickResetBackEnd',
                    'click #go-to-portal-button-id': 'onClickGoToPortal'
                },

                constructor: function () {
                    this.givenName = '@HeaderView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    Backbone.setViewProps(this, opts); //has side effects
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
                        var ret = EJS.render(HeaderView.template, {appState: appState, viewState: viewState});
                        self.$el.html(ret);

                    }

                    console.log('re-rendered headerView.');

                    return this;
                },

                onClickLogout: function (event) {
                    event.preventDefault();

                    console.log('attempting to log out...');

                    var self = this;

                    $.ajax({
                        url: '/logout',
                        data: {},
                        dataType: 'json',
                        type: 'POST'
                        //success: function (msg) {
                        //
                        //
                        //},
                        //error: function (err) {
                        //
                        //    //Backbone.history.loadUrl();
                        //}
                        ////always:function(){
                        ////    self.render();
                        ////}
                    }).done(function (msg, textStatus, jqXHR) {
                        if (msg === true) {
                            appState.set('currentUser', null);
                            Backbone.Events.trigger('bootRouter', 'index');
                            //TODO:why does log out work even if router.navigate isn't invoked?
                            //Backbone.history.loadUrl();
                        }
                        else {
                            alert('logout failed on server, please try again.')
                        }

                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('error:', err);
                        alert('internal server error - logout failed.')

                    }).always(function (a, textStatus, b) {
                        self.render();
                    });
                },
                onClickResetAll: function (event) {
                    event.preventDefault();

                    var self = this;

                    var deletes = [];

                    Object.keys(collections).forEach(function (key) {
                        if (collections.hasOwnProperty(key)) {


                            var coll = collections[key];

                            //for (var i = 0; i < coll.models.length; i++) {

                            coll.each(function (model, i) {
                                deletes.push(function (callback) {

                                    console.log(model.givenName);

                                    model.deleteModel({},function (err, model,resp, opts) {

                                        if (err) {
                                            callback(err);
                                        }
                                        else {
                                            model = null;
                                            callback(null, null);
                                        }

                                    });
                                });


                                //}

                            });
                        }
                    });

                    async.parallel(deletes, function (err, results) {

                        if(err){
                            throw err;
                        }
                        else{
                            Backbone.Events.trigger('bootRouter', 'index');
                            //self.render();
                        }
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


                },
                onClickGoToPortal: function (event) {
                    Backbone.Events.trigger('bootRouter', 'portal');
                }
            },
            { //class properties
                template: template
            });

        //HeaderView.template = template;

        return HeaderView;
    });