/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/controllers/all/jobs",
		"app/js/controllers/all/users"
    ],
    function(){

        return {

            "jobs": arguments[0],
			"users": arguments[1]
        }
  });