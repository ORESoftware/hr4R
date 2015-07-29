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
        'app/js/allCollections',
        'app/js/views/loginView',
        'app/js/views/registeredUsersView',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'react',
        'jsx!app/js/views/reactViews/ServiceChooser',
        'text!app/templates/dashboardTemplate.ejs'
    ],


    function (appState, collections, LoginView, RegisteredUsersView, EJS, $, _, Handlebars, Backbone, React, ServiceChooser, template) {


        var DashboardView = Backbone.View.extend({


                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');

                },

                //http://stackoverflow.com/questions/7113049/backbone-js-nesting-views-through-templating

                render: function () {
                    console.log('attempting to render IndexView.');

                    var self = this;

                    var ret = EJS.render(DashboardView.template, {});

                    self.$el.html(ret);

                    var services = [
                        { name: 'Web Development', price: 300 },
                        { name: 'Design', price: 400 },
                        { name: 'Integration', price: 250 },
                        { name: 'Training', price: 220 }
                    ];

                    React.render(
                        <ServiceChooser items={ services } />,
                        $(self.el).find('#service-chooser-example-div-id')[0]
                    );

                    return this;

                }
            },
            { //class properties
                template:template
            });

        return DashboardView;
    });




