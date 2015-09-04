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
        'app/js/jsx/reactComponents/JobsList',
        '#allTemplates'
    ],


    function (appState, collections, EJS, $, _, Adhesive, Backbone, React, JobsList, allTemplates) {

        var template = allTemplates['templates/jobsTemplate.ejs'];

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

                    this.model = this.collection.find(function(model){

                        var _id = model.get('_id');
                        if(_id){
                            return _id.toString() == '55d7ee70636fe6cc2558d41e';
                        }
                    });

                    //this.collection.sortByDateCreated();

                    //this.collection.sortByAttribute('_id');

                    //this.model = this.collection.last();

                    if(this.model == null){
                        var JobModel = this.collection.model;
                        this.model = new JobModel();

                    }

                    //this.collection.add(this.model,{merge:true});
                    //
                    //this.model.persistModel(null,{forceSave:true});

                    console.log('jobs view model cid:',this.model.cid);

                    //this.collection.add(this.model);


                    this.adhesive = new Adhesive(this, {});

                    var self = this;

                    this.adhesive.stick({
                        //keyName: 'job',
                        keyName: 'job:isVerified',
                        models: {
                            //listenTo: [],
                            //update: [],
                            listenTo: [self.model],
                            update: [self.model],
                            //modelEvents: ['model-socket-change-broadcast','model-local-change-broadcast','change'], //works
                            modelEvents: ['model-local-change-broadcast','model-socket-change-broadcast'],
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
                        },

                        limitToEventTarget: false, //will limit updates for just the element touched
                        //limitToClass: '.barf',  //will limit what elements get listened to at all
                        //domElementListen: self.$el,
                        //domElementListen: $(document),
                        //domElementUpdate: self.$el,
                        //domElementUpdate: $(self.el),
                        //domElementUpdate: $(document),

                        //domEventType: 'click',
                        //propagateChangesToServerImmediately: false,
                        callback: null
                    });

                },

                render: function (cb) {

                    var self = this;

                    require(['#allTemplates', '#allViews'], function (allTemplates, allViews) {

                        var template = allTemplates['templates/jobsTemplate.ejs'];

                        var ret = EJS.render(template, {
                            job:self.model,
                            jobs:self.collection,
                            model: self.model,
                            collection: self.collection
                        });

                        self.$el.html(ret);

                        React.render(
                            React.createElement(JobsList, null),
                            $(self.el).find('#jobs-react-example-div-id')[0]
                        );

                        //TODO: make React.render work with this.el or this.$el

                        if(typeof cb === 'function'){
                            cb();
                        }

                    },function(err){
                        console.error(err);
                        throw err;
                    });
                }
            },
            {
                template: template
            });


        return JobsView;

    });

