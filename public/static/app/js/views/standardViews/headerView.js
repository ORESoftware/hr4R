/**
 * Created by amills001c on 6/16/15.
 */

//TODO:https://github.com/marionettejs/backbone.marionette/issues/611
//TODO: load CSS ===> http://requirejs.org/docs/faq-advanced.html

console.log('loading headerView');

define(
    [
        '#appState',
        '#viewState',
        'async',
        '#allCollections',
        'app/js/allModels',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'app/js/Adhesive',
        'backbone',
        'backbone-validation',
        'app/js/giant',
        '#allTemplates'
        //'text!app/templates/header.ejs'
    ],


    function (appState, viewState, async, collections, models, form2js, EJS, $, _, Adhesive, Backbone, BackboneValidation, giant, allTemplates) {

        var template = allTemplates.HeaderTemplate;


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
                    'click #disconnect-socket-button-id': 'onClickDisconnectSocket'
                },

                constructor: function () {
                    this.givenName = '@HeaderView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onClickResetAll', 'onClickResetFrontEnd', 'onClickResetBackEnd');

                    this.adhesive = new Adhesive(this, {});

                    var self = this;

                    this.adhesive.stick({
                        keyName: 'socket',
                        plainObjects: {
                            listenTo: [giant.socketEvents],
                            update: [],
                            events: ['socket-error', 'socket-disconnected', 'socket-connected']
                        },
                        domElementUpdate: $(self.el),
                        callback: null
                    });
                },

                render: function () {
                    console.log('attempting to render HeaderView.');

                    var self = this;

                    var ret = EJS.render(HeaderView.template, {
                        appState: appState,
                        viewState: viewState,
                        socketConnection: giant.getSocketIOConn().id
                    });
                    self.$el.html(ret);

                    console.log('re-rendered headerView.');

                    return this;
                },

                onClickDisconnectSocket: function (event) {
                    event.preventDefault();

                    try{
                        giant.getSocketIOConn().disconnect();
                    }
                    catch(err){
                        return alert('socket failed disconnect --->' + err.toString());
                    }
                    return alert('socket disconnected successfully');
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


                            //TODO: make this use async.each instead of async.parallel

                            var coll = collections[key];

                            coll.each(function (model, i) {
                                deletes.push(function (callback) {

                                    console.log(model.givenName);

                                    model.deleteModel({}, function (err, model, resp, opts) {

                                        if (err) {
                                            console.error(err);
                                            callback(null);
                                        }
                                        else {
                                            model.clear();
                                            model = null;
                                            callback(null, null);
                                        }

                                    });
                                });
                            });
                        }
                    });

                    async.parallel(deletes, function (err, results) {

                        if (err) {
                            console.error(err);
                        }
                        else {
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


                }
            },
            { //class properties
                template: template
            });

        //HeaderView.template = template;

        return HeaderView;
    });