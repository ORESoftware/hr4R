/**
 * Created by amills001c on 7/13/15.
 */


/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading allViews');

//var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

//TODO: https://learn.jquery.com/ajax/working-with-jsonp/
//TODO: http://jlongster.com/Removing-User-Interface-Complexity,-or-Why-React-is-Awesome
//TODO: https://github.com/baconjs/bacon.js/tree/master
//TODO: https://www.reddit.com/r/javascript/comments/30amaa/integrating_react_with_backbone/


/*
react notes

let react handle all the HTML - no more templates or handlebars
use bb models/collections as react props
update react components on backbone.js events

*/

//TODO: http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/

define('app/js/ReactViewFactory',

    [
        'React'
    ],

    function (React) {

        function createReactElement(displayName){

            var elem = React.createClass({displayName: "Timer",
                getInitialState: function() {
                    return {secondsElapsed: 0};
                },
                tick: function() {
                    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
                },
                componentDidMount: function() {
                    this.interval = setInterval(this.tick, 1000);
                },
                componentWillUnmount: function() {
                    clearInterval(this.interval);
                },
                render: function() {
                    return (
                        React.createElement("div", null, "Seconds Elapsed: ", this.state.secondsElapsed)
                    );
                }
            });

            //var MyComponent = React.createFactory(MyComponentClass); // New step
            //React.render(React.createElement(Timer, null), mountNode);

            return elem;
        }


        return createReactElement;
    });