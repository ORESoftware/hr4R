define(function (require, exports, module) {
    'use strict';

    function IdempotentJSON() {
    }

    IdempotentJSON.prototype.parse = function (obj, cb) {

        if (typeof obj !== 'string') {
            console.error('looks like you have called IdempotentJSON.parse on an object that was already parsed.');
            if (typeof cb === 'function') {
                return cb(null, obj);
            }
            else {
                return obj;
            }
        }
        else {
            try {
                var error = null;
                var ret = JSON.parse(obj);
                if (typeof ret === 'object' && ('stringified' in ret)) {
                    ret = ret.stringified;
                }
                else {
                    error = new Error('Passed in a string to IdempotentJSON.parse that was not called first by IdempotentJSON.stringify');
                }
                if (typeof cb === 'function') {
                    return cb(error, ret);
                }
                else {
                    if (error) {
                        throw error;
                    }
                    return ret;
                }

            }
            catch (err) {
                if (typeof cb === 'function') {
                    return cb(err, null);
                }
                else {
                    throw new Error('You can pass a callback to IdempotentJSON.parse to handle this error:' + err.stack);
                }
            }
        }

    };

    IdempotentJSON.prototype.stringify = function (obj, cb) {

        if (typeof obj === 'string') {
            var index = obj.indexOf('{"stringified"');
            if (index === 0) {
                console.error('Looks like you called IdempotentJSON.stringify() twice on the same object');
                return obj;
            }
        }

        var temp = {stringified: obj};
        try {
            var ret = JSON.stringify(temp);
            if (typeof cb === 'function') {
                cb(null, ret);
            }
            else {
                return ret;
            }

        }
        catch (err) {
            if (typeof cb === 'function') {
                cb(err, null);
            }
            else {
                throw new Error('You should pass a callback to IdempotentJSON.stringify to handle this error:' + err.stack);
            }
        }


    };


    module.exports = new IdempotentJSON();

});