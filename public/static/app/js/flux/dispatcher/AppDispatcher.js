/**
 * Created by denmanm1 on 8/25/15.
 */



//TODO: https://github.com/facebook/flux/tree/master/examples/flux-todomvc/js
//TODO: https://scotch.io/tutorials/learning-react-getting-started-and-concepts
//TODO: https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture
//TODO: https://medium.com/brigade-engineering/what-is-the-flux-application-architecture-b57ebca85b9e

//TODO: prevent changes in collection/models from triggering the re-rendering of views that are not in currentView/mainView
//TODO it's a waste to (re)render a view that can't be seen by the user anyway right


define(function (require) {

    var Dispatcher = require('flux').Dispatcher;

    var AppDispatcher = new Dispatcher();

    // Convenience method to handle dispatch requests
    AppDispatcher.handleAction = function (action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    };

    // Convenience method to handle dispatch requests
    AppDispatcher.handleHTTPServerAction = function (action) {
        this.dispatch({
            source: 'HTTP_SERVER_ACTION',
            action: action
        });
    };

    // Convenience method to handle dispatch requests
    AppDispatcher.handleSocketServerAction = function (action) {
        this.dispatch({
            source: 'SOCKET_SERVER_ACTION',
            action: action
        });
    };

    return AppDispatcher;

});