/**
 * Created by amills001c on 6/16/15.
 */

//TODO:https://github.com/marionettejs/backbone.marionette/issues/611
//TODO: load CSS ===> http://requirejs.org/docs/faq-advanced.html

console.log('loading headerView');

define(
    [
        '+appState',
        '+viewState',
        'async',
        '#allCollections',
        '#allModels',
        'form2js',
        'ejs',
        'underscore',
        '#Adhesive',
        'backbone-validation',
        '@oplogSocketClient',
        'require'
    ],


    function (appState, viewState, async, collections, models, form2js, EJS, _, Adhesive, BackboneValidation, osc, require) {


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
                    'click #hot-reload-button-id': 'onClickHotReload',
                    'click #reset-all-button-id': 'onClickResetAll',
                    'click #reset-front-end-button-id': 'onClickResetFrontEnd',
                    'click #reset-back-end-button-id': 'onClickResetBackEnd',
                    'click #reconnect-socket-button-id': 'onClickReconnectSocket',
                    'click #disconnect-socket-button-id': 'onClickDisconnectSocket'
                },

                constructor: function () {
                    this.givenName = '@HeaderView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render', 'onClickResetAll', 'onClickResetFrontEnd', 'onClickResetBackEnd');


                    var self = this;

                    this.listenTo(this.model, 'change', this.render);
                    this.listenTo(this.collection, 'change', this.render);

                    this.adhesive = new Adhesive(self, {

                    }).stick({
                        keyName: 'socket',
                        domElementUpdate: self.$el,
                        plainObjects: {
                            listenTo: [osc.socketEvents],
                            update: [],
                            //events: ['socket-error', 'socket-disconnected', 'socket-connected']
                            events: ['all']
                        }
                    });
                },

                render: function () {

                    //if (!window.documentIsReady) {
                    //    return;
                    //}

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/headerTemplate.ejs'];

                    var socketConnection = readFromLocalStorage('use_socket_server');

                    var ret = EJS.render(template, {
                        appState: appState,
                        viewState: viewState,
                        socketConnection: socketConnection
                    });
                    self.$el.html(ret);

                    return this;

                },

                onSocketDisconnected: function () {
                    //alert('socket disconnected successfully');
                },

                onClickReconnectSocket: function (event) {
                    event.preventDefault();

                    try {
                        osc.getSocketIOConn().connect();
                    }
                    catch (err) {
                        alert('socket failed reconnect --->' + err.toString());
                    }
                },

                onClickDisconnectSocket: function (event) {
                    event.preventDefault();

                    try {
                        osc.getSocketIOConn().disconnect();
                    }
                    catch (err) {
                        alert('socket failed disconnect --->' + err.toString());
                    }
                },

                onClickLogout: function (event) {
                    event.preventDefault();

                    //TODO: for some reason the server is logging this POST request as occuring twice or more, why?
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
                onClickHotReload: function (event) {

                    //var toReload = ['text!app/templates/headerTemplate.ejs'];
                    //
                    // var self = this;
                    //
                    // window.hotReload(toReload,function(err,results){
                    //
                    //     HeaderView.template = results[0];
                    //     self.render();
                    //
                    // });

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
                                            callback(err);
                                        }
                                        else {
                                            model.clear();
                                            model = null;
                                            callback(null, null);
                                        }

                                    });
                                });
                            });

                            coll.reset();
                        }
                    });

                    async.parallel(deletes, function (err, results) {

                        if (err) {
                            console.error(err);
                            throw err;
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
                //template: template
            });


        return HeaderView;
    });