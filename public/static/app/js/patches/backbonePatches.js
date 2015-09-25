/**
 * Created by denmanm1 on 9/8/15.
 */



define(function(){

    //Backbone.View = function(options) {
    //    this.cid = _.uniqueId('view');
    //    //_.extend(this, _.pick(options, viewOptions)); //fuck this
    //    this._ensureElement();
    //    this.initialize.apply(this, arguments);
    //};


    Backbone.setCollectionOptions = function (model, options) {


    };

    Backbone.View.prototype.setViewProps = function (options) {

        var opts = options || {};

        var temp = _.defaults({}, opts, _.result(this, 'defaults'));

        //var temp = _.defaults(_.result(this, 'defaults'),opts);

        //_.defaults(this, _.result(this, 'defaults'));
        //
        //console.log(this);

        //_.defaults(view, opts, _.result(view, 'defaults'));
        //
        // console.log(view);

        for (var prop in temp) {
            if (temp.hasOwnProperty(prop) && prop !== undefined) {
                if (temp[prop] !== undefined) {
                    this[prop] = temp[prop];
                    //console.log('new view property:',this[prop]);
                }
            }
        }
    };

    Backbone.syncCollection = function (collection, cb) {

        collection.persistCollection({}, function (err, results) {
            if (err) {
                cb(err);
            }
            else {
                //TODO: fire events here to signify that collection has been persisted, needsPersistence is false

                collection.fetch(
                    {
                        success: function (msg) {
                            //TODO: fire events here to signify to adhesive views to update DOM elements
                            cb(null, msg);
                        },
                        error: function (err) {
                            cb(err)
                        }
                    });
            }
        });
    };

    Backbone.batchSyncCollection = function (collection, cb) {

        var batchData = {create: [], destroy: [], update: []};

        for (var i = 0; i < collection.models.length; i++) {

            var model = collection.models[i];
            batchData.update.push(model.toJSON());
        }

        $.ajax({
            type: "POST",
            url: collection.batchURL,
            dataType: "json",
            data: batchData
        }).done(function (msg) {

            console.log(msg);
            cb(msg);

        }).fail(function (msg) {

            console.log(msg);
            cb(msg);

        }).always(function (msg) {

            console.log(msg);
            cb(msg);

        });
    };

    //Backbone.batchSyncCollection(collections.users, function (msg) {
    //    console.log(IJSON.parse(msg));
    //});

    Backbone.batchSaveCollection = function (collection, cb) {

        collection.persist(function (err, res) {
            if (err) {
                cb(err);
            }
            else {
                collection.fetch(
                    {
                        success: function (msg) {
                            cb(null, msg);
                        },
                        error: function (err) {
                            cb(err)
                        }
                    });
                //TODO: convert this to done,fail,always
            }
        });
    };



});