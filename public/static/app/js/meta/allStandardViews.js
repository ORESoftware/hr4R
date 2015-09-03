/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/jsx/standardViews/IndexView",
		"app/js/jsx/standardViews/dashboardView",
		"app/js/jsx/standardViews/footerView",
		"app/js/jsx/standardViews/headerView",
		"app/js/jsx/standardViews/homeView",
		"app/js/jsx/standardViews/loginView",
		"app/js/jsx/standardViews/overviewView",
		"app/js/jsx/standardViews/pictureView",
		"app/js/jsx/standardViews/portalView",
		"app/js/jsx/standardViews/registeredUsersView",
		"app/js/jsx/standardViews/userProfileView"
    ],
    function(){

        return {

            "IndexView": arguments[0],
			"dashboardView": arguments[1],
			"footerView": arguments[2],
			"headerView": arguments[3],
			"homeView": arguments[4],
			"loginView": arguments[5],
			"overviewView": arguments[6],
			"pictureView": arguments[7],
			"portalView": arguments[8],
			"registeredUsersView": arguments[9],
			"userProfileView": arguments[10]
        }
  });