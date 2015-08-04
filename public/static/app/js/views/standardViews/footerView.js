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
        //'text!app/templates/footer.ejs'
        '#allTemplates'
    ],



    function (appState, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, allTemplates) {

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

                constructor: function () {
                    this.givenName = '@FooterView';
                    Backbone.View.apply(this, arguments);
                },

                initialize: function (opts) {

                    this.setViewProps(opts); //has side effects
                    _.bindAll(this, 'render');
                    //this.listenTo(this.model, 'change', this.render);
                    //this.listenTo(this.collection, 'reset', this.render);

                },
                render: function () {
                    console.log('attempting to render FooterView.');

                    var self = this;

                    if (FooterView.template == null) {

                        console.log('footerView template is null, retrieving from server.');

                        $.ajax({
                            url: 'static/html/ejs/footer.ejs',
                            type: 'GET',
                            success: function (msg) {
                                FooterView.template = msg;
                                var ret = EJS.render(FooterView.template, appState.value);
                                //console.log('login view:', ret);
                                self.$el.html(ret);
                            },
                            error: function (err) {
                                //console.log('error:', err);
                                alert(err.toString());
                            }
                        });
                    }
                    else {

                        var ret = EJS.render(FooterView.template, appState.value);
                        self.$el.html(ret);

                    }

                    console.log('re-rendered FooterView.');
                    this.delegateEvents();
                    return this;
                },

                onClickFooter: function (event) {
                    event.preventDefault();

                    console.log('clicked footer...');

                    $.ajax({
                        url: '/testSocketIO',
                        type: 'GET',
                        success: function (msg) {
                            console.log(msg);
                        },
                        error: function (err) {
                            alert(err.toString());
                        }
                    });

                }
            },
            {//class properties
                template: template

            });

        //FooterView.template = template;

        return FooterView;
    });