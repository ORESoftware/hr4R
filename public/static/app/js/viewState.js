/**
 * Created by amills001c on 6/18/15.
 */



define('app/js/viewState',function() {

    var view = {

        "headerView": null,
        "mainView": null,
        "footerView": null

    };

    return {
        get: function($viewName){
            return view[$viewName];
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