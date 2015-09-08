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
		"app/js/controllers/all/more/cars",
		"app/js/controllers/all/more/evenMore/spaceships",
		"app/js/controllers/all/users"
    ],
    function(){

        return {

            "jobs": arguments[0],
			"more/cars": arguments[1],
			"more/evenMore/spaceships": arguments[2],
			"users": arguments[3]
        }
  });