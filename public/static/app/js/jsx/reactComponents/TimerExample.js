/**
 * Created by denmanm1 on 7/21/15.
 */


//TODO: http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/
//TODO: https://scotch.io/tutorials/getting-to-know-flux-the-react-js-architecture
//TODO: https://baconjs.github.io/
//TODO: https://github.com/Reactive-Extensions/RxJS
//TODO: https://egghead.io/lessons/rxjs-what-is-rxjs
//TODO: http://www.ractivejs.org/
//TODO: https://blog.risingstack.com/functional-reactive-programming-with-the-power-of-nodejs-streams/


define(
    [
        'react'
    ],

    function (React) {

        /** @jsx React.DOM */
        var TimerExample = React.createClass({displayName: "TimerExample",

            getInitialState: function () {

                // This is called before our render function. The object that is
                // returned is assigned to this.state, so we can use it later.
                return {elapsed: 0, start: Date.now()};
            },

            componentDidMount: function () {

                // componentDidMount is called by react when the component
                // has been rendered on the page. We can set the interval here:
                this.timer = setInterval(this.tick, 50);
            },

            componentWillUnmount: function () {

                // This method is called immediately before the component is removed
                // from the page and destroyed. We can clear the interval here:
                clearInterval(this.timer);
            },

            tick: function () {

                // This function is called every 50 ms. It updates the
                // elapsed counter. Calling setState causes the component to be re-rendered
                this.setState({elapsed: new Date() - this.props.start});
            },

            render: function () {

                var elapsed = Math.round(this.state.elapsed / 100);
                var seconds = (elapsed / 10).toFixed(1);

                return (
                    React.createElement("div", null, 
                        React.createElement("p", null, "This example was started ", React.createElement("b", null, seconds, " seconds"), " ago.")
                    )
                );
            }
        });



        return TimerExample;

    });