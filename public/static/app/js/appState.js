/**
 * Created by amills001c on 7/1/15.
 */



define('#appState',function() {

    /*
    * here we store the application state, everything that will go into localStorage will come from here
    *
    * when currentUser is set, we set authorized to true, always, by default
    * however when authorized is set to false, we don't necessarily set currentUser to null
    *
    * */

    var appState = {

        currentUser: null,
        authorized: null,
        hasSession: null,
        env: null

    };

    return {
        value: appState,
        getV: function(val){
            return appState[val];
        },
        setV: function(prop,val){
            if(prop in appState){
                console.log('application state changed from this :',appState);
                if(prop === 'currentUser' && val instanceof window.Backbone.Model){
                    appState['authorized'] = true;
                }
                else{
                    appState['authorized'] = false;
                }
                appState[prop] = val;
                console.log('application state changed to :',appState);
            }
            else{
                throw new Error('no appState property matched.');
            }
        },
        get: function(val){
            return appState[val];
        },
        set: function(prop,val){
            if(prop in appState){
                console.log('application state from this :',appState);
                if(prop === 'currentUser' && val !== null){
                    appState['authorized'] = true;
                }
                else{
                    appState['authorized'] = false;
                }
                appState[prop] = val;
                console.log('application state changed to :',appState);
            }
            else{
                throw new Error('no appState property matched.');
            }
        }
    }
});