/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading headerView');

define(['app/js/routers','app/js/models', 'form2js','ejs','jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (routers, models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var router = routers(null).bootRouter;

        var HeaderView = Backbone.View.extend({

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            model:null,

            template: null,

            //el: '#header-div-id',

            el: '#index_header_div_id',

            events: {
                'click #logout-button-id': 'onClickLogout'
            },

            initialize: function () {
                _.bindAll(this, "render");
                //this.collection.bind("reset", this.render);
                //this.model.bind('change', this.render);
            },
            render: function () {
                console.log('attempting to render HeaderView.');

                var self = this;

                if(self.template == null){

                    $.ajax({
                        url: 'static/html/ejs/header.ejs',
                        type: 'GET',
                        success: function (msg) {
                            self.template = msg;
                            var ret = EJS.render(self.template, appGlobal);
                            self.$el.html(ret);
                        },
                        error: function (err) {
                            alert(err.toString());
                        }
                    });
                }
                else{

                    var ret = EJS.render(self.template, appGlobal);
                    self.$el.html(ret);

                }

                console.log('re-rendered FooterView.');

                return this;
            },

            onClickLogout: function(event){
                event.preventDefault();

                console.log('attempting to log out...');

                $.ajax({
                    url: '/logout',
                    data: {},
                    dataType: 'json',
                    type: 'POST',
                    success: function (msg) {
                        if(msg === true){
                            appGlobal.currentUser = null;
                            appGlobal.authorized = false;
                            router.navigate('index',{trigger:true});
                            Backbone.history.loadUrl();
                        }
                        else{
                            alert('logout failed.')
                        }


                    },
                    error: function (err) {
                        console.log('error:', err);
                        alert('internal server error - logout failed.')
                        appGlobal.currentUser = null;
                        appGlobal.authorized = false;
                        router.navigate('index',{trigger:true});
                        Backbone.history.loadUrl();
                    }
                });

            }
        });

        return HeaderView;
    });