/**
 * Created by amills001c on 7/1/15.
 */



define('#appState',

    [
        'observe',
        'underscore'
    ],

    function (Observe,_) {

    /*
     * here we store the application state, everything that will go into localStorage will come from here
     *
     * when currentUser is set, we set authorized to true, always, by default
     * however when authorized is set to false, we don't necessarily set currentUser to null
     *
     * */

    var $_appState = {

        currentUser: null,
        authorized: null,
        hasSession: null,
        env: null,
        socketConnection:null

    };

    var appStateOldValue = null;

    Platform.performMicrotaskCheckpoint(function(){
        Object.observe($_appState, function(changes){
            console.log('application state changed *from* this :', appStateOldValue);
            console.log('application state changed to :', $_appState);
            appStateOldValue = _.clone($_appState);
        });
    });


    function setCurrentUserOnEvent(user) {
        Backbone.Events.listenTo(user, 'destroy', function (model, modelCollection, opts) {
            var user = $_appState.currentUser;
            $_appState.currentUser = null;
        });
    }

    return {
        value: $_appState,
        currentUserSessionIsOK: function(){
            return ($_appState.currentUser && $_appState.currentUser.get('username') != null && $_appState.authorized === true);
        },
        get: function (val) {
            return $_appState[val];
        },
        set: function (prop, val) {
            if (prop in $_appState) {
                //console.log('application state from this :', appState);
                if (prop === 'currentUser') {
                    if (val !== null) {
                        setCurrentUserOnEvent(val);
                        $_appState['authorized'] = true;
                    }
                    else {
                        $_appState['authorized'] = false;
                    }
                }
                $_appState[prop] = val;
                //console.log('application state changed to :', appState);
            }
            else {
                throw new Error('no appState property matched.');
            }
        }
    }
});