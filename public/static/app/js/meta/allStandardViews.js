/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "app/js/jsx/standardViews/dashboardView",
		"app/js/jsx/standardViews/footerView",
		"app/js/jsx/standardViews/headerView",
		"app/js/jsx/standardViews/homeView",
		"app/js/jsx/standardViews/IndexView",
		"app/js/jsx/standardViews/loginView",
		"app/js/jsx/standardViews/overviewView",
		"app/js/jsx/standardViews/pictureView",
		"app/js/jsx/standardViews/portalView",
		"app/js/jsx/standardViews/registeredUsersView",
		"app/js/jsx/standardViews/userProfileView"
    ],
    function(){

        return {

            "DashboardView": arguments[0],
			"FooterView": arguments[1],
			"HeaderView": arguments[2],
			"HomeView": arguments[3],
			"IndexView": arguments[4],
			"LoginView": arguments[5],
			"OverviewView": arguments[6],
			"PictureView": arguments[7],
			"PortalView": arguments[8],
			"RegisteredUsersView": arguments[9],
			"UserProfileView": arguments[10]
        }
  });