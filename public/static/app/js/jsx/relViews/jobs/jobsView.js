/**
 * Created by denmanm1 on 7/31/15.
 */


/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        '+appState',
        '#allCollections',
        'ejs',
        'underscore',
        '#Adhesive',
        'react'
    ],


    function (appState, collections, EJS, _, Adhesive, React) {


        var JobsView = Backbone.View.extend({

                defaults: function () {

                    return {
                        model: null,
                        collection: collections.jobs,
                        childViews: {}
                    }
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');

                    this.model = this.collection.find(function (model) {

                        var id = model.get('_id');
                        if (id) {
                            return id.toString() == '55f9ddb8cc219156ba26d6c8';
                        }
                    });


                    if (this.model == null) {
                        var JobModel = this.collection.model;
                        this.model = new JobModel();

                    }

                    var self = this;

                    this.adhesive = new Adhesive(this, {

                    }).stick({
                        keyName: 'job',
                        domEventType: 'keyup',
                        limitToEventTarget: true, //will limit updates for just the element touched
                        //keyName: 'job:isVerified',
                        models: {
                            //listenTo: [],
                            //update: [],
                            listenTo: [self.model],
                            update: [self.model],
                            //modelEvents: ['model-socket-change-broadcast','model-local-change-broadcast','change'], //works
                            modelEvents: ['model-local-change-broadcast', 'model-socket-change-broadcast'],
                            //modelEvents: ['model-socket-change-broadcast','change'], //works
                            //modelEvents: ['change'],
                            where: {}
                        },
                        collections: {
                            //listenTo: [self.collection],
                            //update: [self.collection],
                            listenTo: [],
                            update: [],
                            //TODO: loop with coll-local-change
                            //collectionEvents: ['coll-local-change-broadcast','coll-socket-change-broadcast']
                            collectionEvents: []
                            //where: {cid:self.model.cid},
                            //filterUpdate: function(model){
                            //    return model.cid == self.model.cid;
                            //},
                            //filterListenTo: function(model){
                            //    return model.cid == self.model.cid;
                            //}
                        }
                        //limitToClass: '.barf',  //will limit what elements get listened to at all
                        //domElementListen: self.$el,
                        //domElementListen: $(document),
                        //domElementUpdate: self.$el,
                        //domElementUpdate: $(self.el),
                        //domElementUpdate: $(document),

                        //domEventType: 'click',
                        //propagateChangesToServerImmediately: false,
                    });

                },

                render: function () {

                    var self = this;//

                    var allTemplates = require('#allTemplates');
                    var allViews = require('#allViews');

                    var template = allTemplates['templates/jobsTemplate.ejs'];
                    var JobsList = allViews['reactComponents/JobsList'];

                    var ret = EJS.render(template, {
                        job: self.model,
                        jobs: self.collection,
                        model: self.model,
                        collection: self.collection
                    });

                    self.$el.html(ret);

                    React.render(
                        React.createElement(JobsList, null),
                        $(self.el).find('#jobs-react-example-div-id')[0]
                    );

                    //TODO: make React.render work with this.el or this.$el

                    return this;
                }
            },
            {
                //template: template
            });


        return JobsView;

    });

