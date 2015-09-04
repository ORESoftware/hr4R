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
        'backbone',
        'react'
    ],


    function (appState, collections,EJS, $, _, Backbone, React) {


        var OverviewView = Backbone.View.extend({

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');
                    this.listenTo(this.collection, 'add remove', this.render);

                    //this.model = new models.UserModel();
                },

                render: function (cb) {

                    var libraries = [

                        {name: 'Backbone.js', url: 'http://documentcloud.github.io/backbone/'},
                        {name: 'AngularJS', url: 'https://angularjs.org/'},
                        {name: 'jQuery', url: 'http://jquery.com/'},
                        {name: 'Prototype', url: 'http://www.prototypejs.org/'},
                        {name: 'React', url: 'http://facebook.github.io/react/'},
                        {name: 'Ember', url: 'http://emberjs.com/'},
                        {name: 'Knockout.js', url: 'http://knockoutjs.com/'},
                        {name: 'Dojo', url: 'http://dojotoolkit.org/'},
                        {name: 'Mootools', url: 'http://mootools.net/'},
                        {name: 'Underscore', url: 'http://documentcloud.github.io/underscore/'},
                        {name: 'Lodash', url: 'http://lodash.com/'},
                        {name: 'Moment', url: 'http://momentjs.com/'},
                        {name: 'Express', url: 'http://expressjs.com/'},
                        {name: 'Koa', url: 'http://koajs.com/'}

                    ];

                    var self = this;

                    require(['#allTemplates','#allReactComponents'],function(allTemplates,allReactComponents){

                        var template = allTemplates['templates/overviewTemplate.ejs'];

                        var ret = EJS.render(template, {});

                        self.$el.html(ret);

                        var SearchExample = allReactComponents['RealTimeSearchView'];

                        React.render(
                            <SearchExample items={ libraries }/>,
                            $(self.el).find('#real-time-search-example-div-id')[0]
                        );

                        if (typeof cb === 'function') {
                            cb();
                        }
                    });


                    //TODO: make React.render work with this.el or this.$el

                }
            },
            {
                //template: template
            });


        return OverviewView;

    });

