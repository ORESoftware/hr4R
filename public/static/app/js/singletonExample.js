/**
 * Created by amills001c on 6/18/15.
 */


var nextInstId = 0;
define('impl/myclass', [], function(){
    'use strict';

    var MyClass = (function() {

        function MyClass() {
            var self = this,
                _instId = nextInstId++;

            self.write = function(text) {
                $('pre#output').append(_instId + ': ' + text + '\r\n');
            };
        };

        return MyClass;
    })();

    return MyClass;
});

define('inst/myclass', ['impl/myclass'], function(MyClass) {
    return new MyClass();
});

// EXAMPLE OF USAGE
require(['inst/myclass'], function (myClass) {
    myClass.write('This is first output from singleton');
});