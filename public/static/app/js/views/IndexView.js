/**
 * Created by amills001c on 6/9/15.
 */


//define(['app/js/collections', 'jquery', '../../../../../bower_components/underscore/underscore', 'handlebars', 'backbone', 'backbone-validation'],


define(['app/js/collections', 'jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, $, _, Handlebars, Backbone, BackboneValidation) {


        var IndexView = Backbone.View.extend({

            el:'#main-div-id',

            initialize: function () {
                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
            },
            render: function () {
                console.log('attempting to render IndexView.');
                //var template = Handlebars.compile($('#some-hbs-template').html());
                //var rendered = template(this.getContext());

                //var Source = document.getElementById("Handlebars-Template").textContent;
                //
                ////Compile the actual Template file
                //var Template = Handlebars.compile(Source);
                //
                ////Generate some HTML code from the compiled Template
                //var HTML = Template({ Recipes : RecipeData });

                var source = $('#some-hbs-template').html();
                var template = Handlebars.compile(source);
                console.log('template:',template);
                var rendered = template({'users':[{'username:':'denman','firstName': 'alex', 'lastName': 'mills'}]});
                this.$el.html(rendered);
                console.log('rendered:',rendered);
            }
        });

        return new IndexView({
            collection: collections.todos
        })

    });