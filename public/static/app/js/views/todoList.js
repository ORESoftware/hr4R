/**
 * Created by amills001c on 7/1/15.
 */



define(['react'],function(React){


    /** @jsx React.DOM */
    var TodoListItem = React.createClass({
        render: function () {
            return <li>{this.props.todo.text}</li>;
        }
    });

    /** @jsx React.DOM */
    var TodoList = React.createClass({
        getInitialState: function () {
            // @TODO: Listen for changes on the underlying model and call
            //          this.setState({ todos: updatedTodos })
            //        every time there is a change.

            return { todos: [{ text: 'Dishes!', dueDate: new Date() }] };
        },

        render: function () {
            var todos = this.state.todos.map(function (todo) {
                return <TodoListItem todo={todo} />;
            });

            return <ul>{todos}</ul>;
        }
    });

    //React.renderComponent(<TodoList />, document.body);

    return TodoList;
});
