/**
 * Created by amills001c on 6/11/15.
 */


define(['app/js/collections', 'ejs','jquery', 'underscore', 'handlebars', 'backbone', 'backbone-validation'],


    function (collections, EJS, $, _, Handlebars, Backbone, BackboneValidation) {


        var HomeView = Backbone.View.extend({

            id: 'HomeViewID',
            tagName: 'HomeViewTagName',
            className: 'HomeViewClassName',

            el: '#main-div-id',

            initialize: function () {
                _.bindAll(this, "render");
                this.collection.bind("reset", this.render);
            },
            render: function () {
                //var template = Handlebars.compile($('#template-someview').html());
                //var rendered = template(this.getContext());
                //return this;

                console.log('attempting to render HomeView.');

                //var Source = document.getElementById("Handlebars-Template").textContent;
                //
                ////Compile the actual Template file
                //var Template = Handlebars.compile(Source);
                //
                ////Generate some HTML code from the compiled Template
                //var HTML = Template({ Recipes : RecipeData });

              /*  var source = $('#some-hbs-template').html();
                //var source= document.querySelector("#some-hbs-template").innerHTML;
                var template = Handlebars.compile(source);
                console.log('template:',template);
                var users = {"hi":'john',"users":[{'username':'denman','firstName': 'alex', 'lastName': 'mills'},
                    {'username':'donald','firstName': 'duck', 'lastName': 'goose'}]};
                var rendered = template(users);
                this.$el.html(rendered);
                console.log('rendered:',rendered);*/

                var data  = {"hi":'john',"users":[{'username':'denman','firstName': 'alex', 'lastName': 'mills'},
                    {'username':'donald','firstName': 'duck', 'lastName': 'goose'}]};
                var html = new EJS({url: '/static/html/ejs/indexEJSTemplate.ejs'}).render(data);

                //var userHomeMainTemplate = document.getElementById('user-home-main-template').innerHTML;
                //this.$el.html(_.template(userHomeMainTemplate)());
                this.$el.html(html);
                console.log('HomeView rendered');
                return this;


                //this.$el.append(rendered);
                //$('#main-div-id').append(rendered);
            }
        });


        return new HomeView({
            collection: collections.todos
        })

    });

