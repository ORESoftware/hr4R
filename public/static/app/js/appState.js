/**
 * Created by amills001c on 7/1/15.
 */



define('app/js/appState',function() {

    var appState = {

        currentUser: null,
        authorized: null,
        env: null

    };

    return {
        get: function(val){
            return appState[val];
        },
        set: function(prop,val){
            if(prop in appState){
                appState[prop] = val;
                console.log(appState[prop]);
            }
            else{
                throw new Error('no appState property matched.');
            }
        }
    }
});