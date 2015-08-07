/**
 * Created by amills001c on 7/31/15.
 */


/**
 * Created by denman on 7/25/2015.
 */


define(
    [
        '#appState',
        '#allCollections',
        'ejs',
        'jquery',
        'underscore',
        'app/js/Adhesive',
        'backbone',
        'react',
        'jsx!app/js/views/reactViews/JobsList',
        '#allTemplates'
        //'text!app/templates/jobsTemplate.ejs'
    ],


    function (appState, collections, EJS, $, _, Adhesive, Backbone, React, JobsList, allTemplates) {

        var template = allTemplates.JobsTemplate;


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

                    //var JobModel = this.collection.model;

                    //this.model = new JobModel();

                    //this.model = this.collection.find(function(model){
                    //
                    //    var _id = model.get('_id');
                    //    if(_id){
                    //        return _id.toString() == '55c13213aaf8352a3a4ab48f';
                    //    }
                    //});

                    this.model = this.collection.first();

                    if(this.model == null){
                        var JobModel = this.collection.model;
                        this.model = new JobModel();
                        this.collection.add(this.model);
                        this.model.persistModel();
                    }

                    console.log('jobs view model cid:',this.model.cid);

                    //this.collection.add(this.model);


                    this.adhesive = new Adhesive(this, {});

                    var self = this;

                    this.adhesive.stick({
                        keyName: 'job',
                        models: {
                            listenTo: [],
                            update: [],
                            //listenTo: [self.model],
                            //update: [self.model],
                            //modelEvents: ['model-local-change-broadcast'],
                            where: {}
                        },
                        collections: {
                            listenTo: [self.collection],
                            update: [self.collection],
                            //listenTo: [],
                            //update: [],
                            //TODO: loop with coll-local-change
                            //collectionEvents: ['coll-change-socket-broadcast', 'coll-local-change-broadcast']
                            collectionEvents: ['coll-local-change-socket-broadcast']
                            //where: {cid:self.model.cid},
                            //filterUpdate: function(model){
                            //    return model.cid == self.model.cid;
                            //},
                            //filterListenTo: function(model){
                            //    return model.cid == self.model.cid;
                            //}
                        },
                        limitToEventTarget: true, //will limit updates for just the element touched
                        //limitToClass: '.barf',  //will limit what elements get listened to at all
                        //domElementListen: self.$el,
                        domElementListen: $(document),
                        //domElementUpdate: $(self.el),
                        domElementUpdate: $(document),

                        domEventType: 'keyup',
                        propagateChangesToServerImmediately: false,
                        callback: null
                    });

                },

                render: function () {

                    var self = this;

                    var ret = EJS.render(JobsView.template, {
                        job:self.model,
                        jobs:self.collection,
                        model: self.model,
                        collection: self.collection
                    });

                    self.$el.html(ret);

                    React.render(
                        <JobsList />,
                        $(self.el).find('#jobs-react-example-div-id')[0]
                    );

                    //TODO: make React.render work with this.el or this.$el

                    return this;

                }
            },
            {
                template: template
            });


        return JobsView;

    });

