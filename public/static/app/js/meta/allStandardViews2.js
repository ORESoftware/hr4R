/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/jsx/standardViews/DasxboardView",
		"app/js/jsx/standardViews/FootexView",
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

            "DasxboardView": arguments[0],
			"FootexView": arguments[1],
			"IndexView": arguments[2],
			"dashboardView": arguments[3],
			"footerView": arguments[4],
			"headerView": arguments[5],
			"homeView": arguments[6],
			"loginView": arguments[7],
			"overviewView": arguments[8],
			"pictureView": arguments[9],
			"portalView": arguments[10],
			"registeredUsersView": arguments[11],
			"userProfileView": arguments[12]
        }
  });