/**
 * Created by amills001c on 6/18/15.
 */



define('app/js/currentView',function() {

    var view = {

        "headerView": null,
        "mainView": null,
        "footerView": null

    };

    return {
        get: function($viewName){
            var v = view[$viewName];
            return v;
        },
        set: function($viewName,$view){
            if($viewName in view){
                view[$viewName] = $view;
                console.log(view[$viewName]);
            }
            else{
                throw new Error('no view matched.');
            }
        }
    }
});