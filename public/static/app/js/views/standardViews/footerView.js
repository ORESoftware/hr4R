/**
 * Created by amills001c on 6/16/15.
 */

console.log('loading footerView');


define(
    [
        '#appState',
        'app/js/allModels',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'app/js/Adhesive',
        //'text!app/templates/footer.ejs'
        '#allTemplates'
    ],


    function (appState, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, Adhesive, allTemplates) {

        var template = allTemplates.FooterTemplate;

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


                    this.listenTo(this.model, 'change', this.render);
                    this.listenTo(this.collection, 'change', this.render);


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
                    //        collectionEvents: ['coll-change-socket-broadcast']
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
                render: function () {
                    console.log('attempting to render FooterView.');

                    var self = this;

                    var ret = EJS.render(FooterView.template, {
                        appState:appState,
                        model: self.model,
                        collection: self.collection
                    });

                    self.$el.html(ret);

                    console.log('re-rendered FooterView.');
                    this.delegateEvents();
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
                template: template

            });

        //FooterView.template = template;

        return FooterView;
    });