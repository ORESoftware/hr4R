/**
 * Created by denmanm1 on 7/1/15.
 */



define(
    [
        'react'
    ],

    function(React){


    /** @jsx React.DOM */
    var TodoListItem = React.createClass({displayName: "TodoListItem",
        render: function () {
            return React.createElement("li", null, this.props.todo.text);
        }
    });

    /** @jsx React.DOM */
    var TodoList = React.createClass({displayName: "TodoList",
        getInitialState: function () {
            // @TODO: Listen for changes on the underlying model and call
            //          this.setState({ todos: updatedTodos })
            //        every time there is a change.

            return { todos: [{ text: 'Dishes!', dueDate: new Date() }] };
        },

        render: function () {
            var todos = this.state.todos.map(function (todo) {
                return React.createElement(TodoListItem, {todo: todo});
            });

            return React.createElement("ul", null, todos);
        }
    });

    //React.renderComponent(<TodoList />, document.body);

    return TodoList;
});
