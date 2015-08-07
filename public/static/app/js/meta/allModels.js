/**
 * Created by amills001c on 7/6/15.
 */


console.log('loading allModels');


define(

    [
        'app/js/models/UserModel',
        'app/js/models/JobModel',
        'exports'
    ],

    function (UserModel, JobModel, exports) {


        return {
            User:UserModel,
            Job: JobModel
        };
    });