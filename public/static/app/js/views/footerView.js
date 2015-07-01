/**
 * Created by amills001c on 6/16/15.
 */

console.log('loading footerView');


define(
    [
        'app/js/models',
        'form2js',
        'ejs',
        'jquery',
        'underscore',
        'handlebars',
        'backbone',
        'backbone-validation',
        'text!app/templates/footer.ejs'
    ],


    function (models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation, template) {


        var FooterView = Backbone.View.extend({

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            className:'FooterView',

            model:null,
            collection:null,

            template:null,

            el: '#index_footer_div_id',

            events: {
                'click #footer-button-id': 'onClickFooter'
            },

            initialize: function (options) {
                this.options = options || {};
                _.bindAll(this, 'render');
                this.listenTo(this.model,'change',this.render);
                this.listenTo(this.collection,'reset',this.render);

            },
            render: function () {
                console.log('attempting to render FooterView.');

                var self = this;

                if(FooterView.template == null){

                    console.log('footerView template is null, retrieving from server.');

                    $.ajax({
                        url: 'static/html/ejs/footer.ejs',
                        type: 'GET',
                        success: function (msg) {
                            FooterView.template = msg;
                            var ret = EJS.render(FooterView.template, appGlobal);
                            //console.log('login view:', ret);
                            self.$el.html(ret);
                        },
                        error: function (err) {
                            //console.log('error:', err);
                            alert(err.toString());
                        }
                    });
                }
                else{

                    var ret = EJS.render(FooterView.template, appGlobal);
                    self.$el.html(ret);

                }

                console.log('re-rendered FooterView.');
                this.delegateEvents();
                return this;
            },
            onClickFooter: function(event){
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
        });

        FooterView.template = template;

        return FooterView;
    });