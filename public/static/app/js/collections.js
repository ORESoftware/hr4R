/**
 * Created by amills001c on 6/9/15.
 */


console.log('loading app/js/COLLECTIONS.js');


define('app/js/collections',

    [
        'underscore',
        'backbone',
        'app/js/models',
        'async'

    ],

    function (_, Backbone, models,async) {

        var UsersCollection = Backbone.Collection.extend({
            // Reference to this collection's model.
            model: models.UserModel,

            //url: function () {
            //    //return '/users?user_id=' + this.options.user_id;
            //    return '/users';
            //},

            url:'/users',
            //urlRoot: '/users',

            persistAsync: function(cb){
                //Backbone.sync('create', this, {
                //    success: function() {
                //        console.log('Saved users collection!');
                //    },
                //    error: function(){
                //        alert('error syncing users collection');
                //    }
                //});

               this.each(function(user,index){  //iterate through models
                  user.save({},{
                      success:function(msg){
                          console.log('saved user --->',msg);
                      },

                      error:function(err){
                       throw new Error('error in users.persist function' + err);
                      }
                  })

               });

                cb(null,null); //TODO: this callback is a cheap shortcut, persistAsync has the right idea

            },

            persist: function(cb){

                var saveArray = [];

                this.each(function(user,index){  //iterate through models, add/push function to async.parallel
                    saveArray.push(
                        function(callback){

                            user.persist(null,function(err,val){
                               callback();
                            });
                        }
                    )

                });

                async.parallel(saveArray,function(err,results){
                    cb(err,results);
                });

            },

            initialize: function (options) {

                console.log('model for UsersCollection is:', this.model);

                this.options = options || {};
                //_.bind(this.initialize,undefined);
                _.bindAll(this, 'persist');

                // This will be called when an item is added. pushed or unshifted
                this.on('add', function (model) {
                    console.log('something got added');
                });
                // This will be called when an item is removed, popped or shifted
                this.on('remove', function (model) {
                    console.log('something got removed');
                });
                // This will be called when an item is updated
                this.on('change', function (model) {
                    console.log('something got changed');
                });
            },

            // Todos are sorted by their original insertion order.
            comparator: 'order'
        });

        return {
            users: new UsersCollection()
        };
    });