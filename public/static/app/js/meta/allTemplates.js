/**
 * Created by denman on 8/1/2015.
 *
 * NOTE: anything written in this file will get overwritten because this file is just metadata
 *  ...so don't bother writing any notes or anything important in this file - it will be overwritten.
 *
 */


define(
    [
        "text!app/templates/dashboardTemplate.ejs",
		"text!app/templates/footerTemplate.ejs",
		"text!app/templates/getAllTemplate.ejs",
		"text!app/templates/headerTemplate.ejs",
		"text!app/templates/homeTemplate.ejs",
		"text!app/templates/indexTemplate.ejs",
		"text!app/templates/jobsTemplate.ejs",
		"text!app/templates/loginTemplate.ejs",
		"text!app/templates/overviewTemplate.ejs",
		"text!app/templates/pictureTemplate.ejs",
		"text!app/templates/portalTemplate.ejs",
		"text!app/templates/registeredUsersTemplate.ejs",
		"text!app/templates/userProfileTemplate.ejs"
    ],
    function(){

        return {

            "templates/dashboardTemplate.ejs": arguments[0],
			"templates/footerTemplate.ejs": arguments[1],
			"templates/getAllTemplate.ejs": arguments[2],
			"templates/headerTemplate.ejs": arguments[3],
			"templates/homeTemplate.ejs": arguments[4],
			"templates/indexTemplate.ejs": arguments[5],
			"templates/jobsTemplate.ejs": arguments[6],
			"templates/loginTemplate.ejs": arguments[7],
			"templates/overviewTemplate.ejs": arguments[8],
			"templates/pictureTemplate.ejs": arguments[9],
			"templates/portalTemplate.ejs": arguments[10],
			"templates/registeredUsersTemplate.ejs": arguments[11],
			"templates/userProfileTemplate.ejs": arguments[12]
        }
  });