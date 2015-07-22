/**
 * Created by amills001c on 7/9/15.
 */


define(['require', 'cssLoader'], function (require, cssLoader) {

    return function (localPath) {
        var pathFromApp = require.toUrl(localPath);
        cssLoader.link(pathFromApp);
    }

});