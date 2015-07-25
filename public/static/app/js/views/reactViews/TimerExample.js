/**
 * Created by amills001c on 7/21/15.
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


        // Create a custom component by calling React.createClass.

        /** @jsx React.DOM */
        var TimerExample = React.createClass({

            getInitialState: function () {

                // This is called before our render function. The object that is
                // returned is assigned to this.state, so we can use it later.

                return {elapsed: 0};
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

                // This will give a number with one digit after the decimal dot (xx.x):
                var seconds = (elapsed / 10).toFixed(1);

                // Although we return an entire <p> element, react will smartly update
                // only the changed parts, which contain the seconds variable.


                return (

                    <div>
                        <MenuExample items={ ['Home', 'Services', 'About', 'Contact us'] } />,
                        <p>This example was started <b>{seconds} seconds</b> ago.</p>
                        <MenuExample items={ ['Home', 'Services', 'About', 'Contact us'] } />,
                    </div>
                );
            }
        });

        /** @jsx React.DOM */
        var MenuExample = React.createClass({

            getInitialState: function () {
                return {focused: 0};
            },

            clicked: function (index) {

                // The click handler will update the state with
                // the index of the focused menu entry

                this.setState({focused: index});
            },

            render: function () {

                // Here we will read the items property, which was passed
                // as an attribute when the component was created

                var self = this;

                // The map method will loop over the array of menu entries,
                // and will return a new array with <li> elements.

                return (
                    <div>
                        <ul>{ this.props.items.map(function (m, index) {

                            var style = '';

                            if (self.state.focused == index) {
                                style = 'focused';
                            }

                            // Notice the use of the bind() method. It makes the
                            // index available to the clicked function:

                            return <li className={style} onClick={self.clicked.bind(self, index)}>{m}</li>;

                        }) }

                        </ul>

                        <p>Selected: {this.props.items[this.state.focused]}</p>
                    </div>
                );

            }
        });

        return TimerExample;

    });