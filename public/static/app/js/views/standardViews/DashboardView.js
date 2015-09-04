/**
 * Created by denman on 7/25/2015.
 */


/**
 * Created by amills001c on 6/9/15.
 */


//TODO: http://codebeerstartups.com/2012/12/5-explaining-views-in-backbone-js-learning-backbone-js/


define(
    [
        '#appState',
        '#allCollections',
        '#allStandardViews',
        'ejs',
        'jquery',
        'underscore',
        'backbone',
        'react',
        '#allReactComponents'
    ],


    function (appState, allCollections, asv, EJS, $, _, Backbone, React, allReactComponents) {


        var DashboardView = Backbone.View.extend({


                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');

                },

                //http://stackoverflow.com/questions/7113049/backbone-js-nesting-views-through-templating

                render: function (cb) {


                    var self = this;

                    require(['#allTemplates', '#allReactComponents'], function (allTemplates, allReactComponents) {

                        var template = allTemplates['templates/dashboardTemplate.ejs'];
                        var ServiceChooser = allReactComponents['ServiceChooser'];

                        var ret = EJS.render(template, {});

                        self.$el.html(ret);

                        var services = [
                            {name: 'Web Development', price: 300},
                            {name: 'Design', price: 400},
                            {name: 'Integration', price: 250},
                            {name: 'Training', price: 220}
                        ];

                        React.render(
                            <ServiceChooser items={ services }/>,
                            $(self.el).find('#service-chooser-example-div-id')[0]
                        );

                        if (typeof cb === 'function') {
                            cb();
                        }

                    },function(err){
                        console.error(err);
                        throw err;
                    });

                }
            },
            { //class properties
                //template: template
            });


        return DashboardView;
    });




