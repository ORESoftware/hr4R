/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        //'require'

        "jsx!app/js/views/relViews/getAll/getAll",
		"jsx!app/js/views/relViews/jobs/jobsView"
    ],
    function(){

        // (obviously, first argument is 'require', so index starts at 1 below)

        return {

            "jsx!app/js/views/relViews/getAll/getAll": arguments[0],
			"jsx!app/js/views/relViews/jobs/jobsView": arguments[1]
        }
});