/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/controllers/jobs",
		"app/js/controllers/users"
    ],
    function(){

        return {

            "controllers/jobs": arguments[0],
			"controllers/users": arguments[1]
        }
  });