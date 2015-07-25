/**
 * Created by amills001c on 7/23/15.
 */



define(
    [
        'backbone',
        'underscore',
        'jquery'
    ],

    function (Backbone, _, $) {


        function Adhesive(view, opts) {

            this.view = view;
            _.extend(this, Backbone.Events);
            this.bind = bind.bind(this); //just to fuck with you, yw, this format is needed in order to debug with Mozilla
        }

        Adhesive.prototype.observe = function () {};

        function bind(opts) {

            var domKeyName = opts.keyName;
            var model = opts.model;
            var property = opts.property;
            var domElement = opts.domElement;
            var eventType = opts.eventType;
            var callback = opts.callback;


            var eventName = 'change';

            if (property != null) {
                eventName = eventName.concat(':').concat(property);
            }

            this.listenTo(model, eventName, function (event) {
                updateDOM(domKeyName, model, domElement, event);
            });

            domElement.on(eventType, function (event) { //click will only be registered in html is in DOM anyway so...assume it is there

                //event.preventDefault();
                if (typeof callback === 'function') {
                    callback(event);
                }
                else {
                    updateBackboneModel(domKeyName, domElement, model, event);
                }
            });
        }

        Adhesive.prototype.bindMany = function () {

        };


        function updateDOM(domKeyName, model, domElement, event) {

            console.log('updateDOM:', domElement, event);

            //if (!document.contains(domElement)) {
            //    console.log('visible document does not contain element, so why update it');
            //    return;
            //}

            domElement.find('*').each(function () {

                //console.log(this);

                var self = this;
                $.each(this.attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-value') {

                        var str = String(domKeyName).concat(':');

                        if (String(value).startsWith(str)) {

                            //var index = String(value).indexOf(str);

                            var propName = String(value).substring(str.length);

                            var prop = model.get(propName);

                            $(self).html(String(prop));

                        }
                    }
                });
            });
        }

        function updateBackboneModel(domKeyName, domElement, model, event) {

            console.log('updateBackboneModel:', model, event);

            domElement.find('*').each(function () {

                var self = this;

                $.each(this.attributes, function (i, attrib) {
                    var name = attrib.name;
                    var value = attrib.value;

                    if (name === 'adhesive-get') {

                        var str = String(domKeyName).concat(':');

                        if (String(value).startsWith(str)) {
                            var propName = String(value).substring(str.length);
                            var val = self.value;
                            var prop = model.set(propName, val);

                            console.log('backbone model property:', propName, 'set to:', val, 'result of setting model:', prop);
                        }
                    }
                });
            });
        }


        return Adhesive;
    }
);