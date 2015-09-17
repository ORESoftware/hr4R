/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/flux/actions/FluxCartActions",
		"app/js/flux/actions/OplogClientActions"
    ],
    function(){

        return {

            "FluxCartActions": arguments[0],
			"OplogClientActions": arguments[1]
        }
  });