/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/models/all/CartProduct",
		"app/js/models/all/Job",
		"app/js/models/all/User"
    ],
    function(){

        return {

            "CartProduct": arguments[0],
			"Job": arguments[1],
			"User": arguments[2]
        }
  });