/**
 * Created by amills001c on 7/9/15.
 */


define(function () {

    var link = function(url) {
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = url;
        document.head.appendChild(css);
    };

    return {
        link: link
    };
});