/**
 * Created by amills001c on 7/6/15.
 */


console.log('loading allModels');


define(

    [
        'app/js/models/userModel',
        'exports'
    ],

    function (UserModel,exports) {


        return {
            User:UserModel
        };
    });