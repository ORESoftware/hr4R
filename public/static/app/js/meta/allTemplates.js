
/**
 * Created by amills001c on 6/16/15.
 */


//TODO: optimized.js file needs a version number in it's name so that browser doesn't mistake old version for new one


console.log('loading #allTemplates');


define(
    [
        'text!app/templates/homeTemplate.ejs',
        'text!app/templates/overviewTemplate.ejs',
        'text!app/templates/pictureTemplate.ejs',
        'text!app/templates/dashboardTemplate.ejs',
        'text!app/templates/headerTemplate.ejs',
        'text!app/templates/footerTemplate.ejs',
        'text!app/templates/jobsTemplate.ejs',
        'text!app/templates/indexTemplate.ejs',
        'text!app/templates/loginTemplate.ejs',
        'text!app/templates/userProfileTemplate.ejs',
        'text!app/templates/portalTemplate.ejs',
        'text!app/templates/getAllTemplate.ejs'
    ],

    function (HomeTemplate, OverviewTemplate, PictureTemplate, DashboardTemplate,
              HeaderTemplate, FooterTemplate, JobsTemplate, IndexTemplate,
              LoginTemplate, UserProfileTemplate, PortalTemplate, GetAllTemplate) {


        return {
            HomeTemplate: HomeTemplate,
            HeaderTemplate: HeaderTemplate,
            FooterTemplate: FooterTemplate,
            DashboardTemplate: DashboardTemplate,
            JobsTemplate: JobsTemplate,
            IndexTemplate: IndexTemplate,
            LoginTemplate: LoginTemplate,
            UserProfileTemplate: UserProfileTemplate,
            PictureTemplate: PictureTemplate,
            PortalTemplate: PortalTemplate,
            GetAllTemplate: GetAllTemplate
        };
    });