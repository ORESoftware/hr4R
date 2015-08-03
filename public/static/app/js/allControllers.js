/**
 * Created by denman on 8/1/2015.
 */


define(
    [
        'require'

        , "app/js/./controllers/jobs"
    ],
    function(){

        // (obviously, first argument is 'require', so index starts at 1 below)

        return {

            "app/js/./controllers/jobs": arguments[1]
        }
});