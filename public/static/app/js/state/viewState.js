/**
 * Created by amills001c on 6/18/15.
 */



define('#viewState',function() {

    var view = {

        "headerView": null,
        "mainParentView": null,
        "mainView": null,
        "footerView": null

    };

    return {
        value: view,
        get: function($viewName){
            var temp = view[$viewName];
            return temp;
        },
        set: function($viewName,$view){
            if($viewName in view){
                view[$viewName] = $view;
            }
            else{
                throw new Error('no view matched.');
            }
        }
    }
});