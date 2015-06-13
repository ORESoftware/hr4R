/**
 * Created by amills001c on 6/11/15.
 */



define(['app/js/collections', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, $, _, Handlebars, Backbone, BackboneValidation) {


        var LoginView = Backbone.View.extend({

            model:null,
            collection: null,

            initialize: function () {
                _.bindAll(this, "render");
                //this.collection.bind("reset", this.render);
            },
            render: function () {
                //var template = Handlebars.compile($('#template-someview').html());
                //var rendered = template(this.getContext());

                console.log('attempting to render LoginView.');

                //var Source = document.getElementById("Handlebars-Template").textContent;
                //
                ////Compile the actual Template file
                //var Template = Handlebars.compile(Source);
                //
                ////Generate some HTML code from the compiled Template
                //var HTML = Template({ Recipes : RecipeData });

                //var source = $('#some-hbs-template').html();
                //var template = Handlebars.compile(source);
                //console.log('template:',template);
                //var rendered = template({'users':[{'username:':'denman','firstName': 'alex', 'lastName': 'mills'}]});
                //this.$el.html(rendered);
                //console.log('rendered:',rendered);

                return this;
            }
        });

        return LoginView;

    });