/**
 * Created by amills001c on 6/9/15.
 */


define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var messages = require('./messages');

    // Load library/vendor modules using
    // full IDs, like:
    var print = require('print');

    print(messages.getHello());

    return new String('dude');
});