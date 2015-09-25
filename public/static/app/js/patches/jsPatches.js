/**
 * Created by denmanm1 on 9/8/15.
 */


define(function(){


    if (typeof String.prototype.startsWith !== 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }


});