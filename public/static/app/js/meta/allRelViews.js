/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/jsx/relViews/getAll/getAll",
		"app/js/jsx/relViews/jobs/jobsView"
    ],
    function(){

        return {

            "relViews/getAll/getAll": arguments[0],
			"relViews/jobs/jobsView": arguments[1]
        }
  });