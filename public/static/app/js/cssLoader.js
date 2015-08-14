/**
 * Created by amills001c on 7/9/15.
 */

//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript

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