/**
 * Created by amills001c on 6/16/15.
 */



define(
    ['socketio',
        'app/js/views/headerView',
        'app/js/views/footerView',
        'app/js/views/registeredUsersView',
        'app/js/views/indexView',
        'app/js/views/loginView',
        'app/js/views/homeView'],

    function (io,HeaderView, FooterView, RegisteredUsersView, IndexView, LoginView, HomeView) {


        //var socket = io.connect('http://localhost:3000');
        //
        //
        //socket.on('chat message', function(msg){
        //   console.log('server sent a message to the client,',msg);
        //});
        //
        //socket.emit('chat message', 'this is the user talking to the server');

        return {
            Header: HeaderView,
            Footer: FooterView,
            Index: IndexView,
            Login: LoginView,
            Home: HomeView,
            RegisteredUsers: RegisteredUsersView
        };
    });