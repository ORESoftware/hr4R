/**
 * Created by amills001c on 6/30/15.
 */


/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading allTemplates');


define(

    [
        'text!app/templates/homeTemplate.ejs',
        'text!app/templates/header.ejs',
        'text!app/templates/footer.ejs'
    ],

    function (HomeTemplate,HeaderTemplate,FooterTemplate) {



        return {
            HomeTemplate: HomeTemplate,
            HeaderTemplate: HeaderTemplate,
            FooterTemplate: FooterTemplate
        };
    });