/**
 * Created by amills001c on 7/9/15.
 */

//TODO: http://www.w3.org/wiki/Dynamic_style_-_manipulating_CSS_with_JavaScript


define(['require', 'cssLoader'], function (require, cssLoader) {

    return function (localPath) {
        var pathFromApp = require.toUrl(localPath);
        cssLoader.link(pathFromApp);
    }

});