/**
 * Created by amills001c on 8/25/15.
 */


console.log('loading app/js/ReactComponentMediator.js');

//TODO: In model, urlRoot is used for the Model. url is used for the instance of the Model.
//TODO: http://beletsky.net/2012/11/baby-steps-to-backbonejs-model.html
//TODO: http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html


define(
    [

        'require',
        '#allViews'
    ],

    function (require) {

        return {
            findReactComponentByName: function (name) {
                return require('#allViews')[name];
            }
        };

    });
