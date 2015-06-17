/**
 * Created by amills001c on 6/16/15.
 */


define(['app/js/models', 'form2js','ejs','jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (models, form2js, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var HeaderView = Backbone.View.extend({

            //id: 'HomeViewID',
            //tagName: 'HomeViewTagName',
            //className: 'HomeViewClassName',

            model:null,

            el: '#header-div-id',

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



                return this;
            },

            onClickLogout: function(event){
                event.preventDefault();

                console.log('logged out...');

            }
        });

        return HeaderView;
    });