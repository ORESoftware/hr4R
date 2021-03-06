/**
 * Created by denmanm1 on 6/16/15.
 */

console.log('loading footerView');


define(
    [
        '+appState',
        '#allModels',
        'form2js',
        'ejs',
        'underscore',
        'backbone-validation',
        '#Adhesive',
        '#allTemplates',
        'require'
    ],


    function (appState, models, form2js, EJS, _, BackboneValidation, Adhesive, allTemplates, require) {

        var template = allTemplates['templates/footerTemplate.ejs'];

        var FooterView = Backbone.View.extend({

                //id: 'HomeViewID',
                //tagName: 'HomeViewTagName',
                //className: 'HomeViewClassName',

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

                el: '#index_footer_div_id',

                events: {
                    'click #footer-button-id': 'onClickFooter'
                },

                //constructor: function () {
                //    this.givenName = '@FooterView';
                //    Backbone.View.apply(this, arguments);
                //},

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');


                    //this.listenTo(this.model, 'change', this.render);
                    //this.listenTo(this.collection, 'change', this.render);


                    //var self = this;
                    //this.adhesive = new Adhesive(self,{});
                    //
                    //this.adhesive.stick({
                    //    keyName: 'user',
                    //    models: {
                    //        //listenTo: [self.model],
                    //        //update: [self.model],
                    //        listenTo: [self.model],
                    //        update: [self.model],
                    //        modelEvents: ['model-local-change-broadcast'],
                    //        where: {}
                    //    },
                    //    collections: {
                    //        listenTo: [self.collection],
                    //        update: [self.collection],
                    //        //listenTo: [],
                    //        //update: [],
                    //        collectionEvents: ['coll-socket-change-broadcast']
                    //        //where: {cid:self.model.cid},
                    //        //filterUpdate: function(model){
                    //        //    return model.cid == self.model.cid;
                    //        //},
                    //        //filterListenTo: function(model){
                    //        //    return model.cid == self.model.cid;
                    //        //}
                    //    },
                    //    limitToEventTarget:true, //will limit updates for just the element touched
                    //    //limitToClass: 'barf',  //will limit what elements get listened to at all
                    //    //domElementListen: self.$el,
                    //    domElementListen: $(document),
                    //    //domElementUpdate: $(self.el),
                    //    domElementUpdate: $(document),
                    //
                    //    domEventType: 'keyup',
                    //    propagateChangesToServerImmediately:false,
                    //    callback: null
                    //});
                },
                render: function (cb) {

                    //if (!window.documentIsReady) {
                    //    return;
                    //}

                    var self = this;

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/footerTemplate.ejs'];

                    var ret = EJS.render(template, {
                        appState: appState,
                        model: self.model,
                        collection: self.collection
                    });

                    self.$el.html(ret);

                    return this;
                },

                onClickFooter: function (event) {
                    event.preventDefault();

                    console.log('clicked footer...');

                    //$.ajax({
                    //    url: '/testSocketIO',
                    //    type: 'GET',
                    //    success: function (msg) {
                    //        console.log(msg);
                    //    },
                    //    error: function (err) {
                    //        alert(err.toString());
                    //    }
                    //});

                }
            },
            {//class properties
                //template: template

            });

        //FooterView.template = template;

        return FooterView;
    });